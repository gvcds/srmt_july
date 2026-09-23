"""
Integração do PLM com o chat do SVP (/ai/analyze).

handle(messages, llm) devolve o markdown da resposta quando a mensagem é uma
consulta ao PLM, ou None para o chat seguir o fluxo normal.
- Código de issue na mensagem (ex.: P250702-00437) -> todos os dados da issue.
- Pedido de issues registradas/fechadas por equipe e período -> resumo, gráficos e lista.
"""
import html
import json
import re
from collections import Counter
from datetime import date

from . import plm_service
from .plm_service import PLMError

MAX_CODES_PER_MESSAGE = 5
MAX_LIST_ITEMS = 60

INTENT_TRIGGER_RE = re.compile(
    r"\bissues?\b|\bplm\b|registrad|fechad|\bclosed?\b|reportad|modification rate|nota d[ao]s? corre",
    re.IGNORECASE,
)

# Campos exibidos primeiro no detalhe da issue (o restante vem depois, na ordem da API)
PRIORITY_FIELDS = [
    "Case Code", "Title", "Progr.Stat.", "Progress Status", "Dev. Mdl. Name/Item Name",
    "Região (Backbone/LA)", "Reg. by", "Reg. by ID", "Registered Date", "Person in charge",
    "S/W Ver.(Date)", "Resolve Option(Medium)", "Resolve Option(Small)", "Nota da correção",
    "Resolve Date", "Resolve confirmer ID", "Resloved Confirm Date",
    "Resolution Confirmation S/W Ver.(Date)", "Close Option",
]
STATUS_FIELDS = ["Progr.Stat.", "Progress Status", "Status"]
LONG_TEXT_LIMIT = 200


# --- Formatação ----------------------------------------------------------

def _safe(value) -> str:
    """Escapa HTML e caracteres que o renderizador de markdown do chat interpretaria."""
    text = html.escape(str(value)).strip()
    return text.replace("*", "&#42;").replace("`", "&#96;").replace("|", "&#124;")


def _is_empty(value) -> bool:
    return value is None or str(value).strip() in ("", "None", "NaT", "null")


def _first(issue: dict, fields):
    for f in fields:
        if not _is_empty(issue.get(f)):
            return str(issue[f]).strip()
    return ""


def _chart(kind: str, title: str, counter: Counter, limit: int = 10) -> str:
    data = [{"name": k or "N/A", "value": v} for k, v in counter.most_common(limit)]
    if not data:
        return ""
    return "```json:chart\n" + json.dumps({"type": kind, "title": title, "data": data}, ensure_ascii=False) + "\n```\n"


def format_issue(issue: dict) -> str:
    code = _safe(issue.get("Case Code", ""))
    lines = [f"## Issue {code}", ""]
    long_texts = []

    ordered = [f for f in PRIORITY_FIELDS if f in issue] + [f for f in issue if f not in PRIORITY_FIELDS]
    for field in ordered:
        value = issue.get(field)
        if _is_empty(value) or field == "Case Code":
            continue
        text = str(value)
        if len(text) > LONG_TEXT_LIMIT or "\n" in text.strip():
            long_texts.append((field, text))
            continue
        lines.append(f"- **{_safe(field)}:** {_safe(text)}")

    for field, text in long_texts:
        lines += ["", f"### {_safe(field)}", _safe(text)]
    return "\n".join(lines)


def _issue_line(issue: dict, closed: bool) -> str:
    parts = [f"**{_safe(issue.get('Case Code', ''))}**"]
    title = _first(issue, ["Title"])
    if title:
        parts.append(_safe(title[:140] + ("..." if len(title) > 140 else "")))
    reg_by = _first(issue, ["Reg. by"])
    if reg_by:
        parts.append(_safe(reg_by))
    if closed:
        parts.append(f"Nota: {_safe(issue.get('Nota da correção', 'N/A'))}")
    else:
        status = _first(issue, STATUS_FIELDS)
        if status:
            parts.append(_safe(status))
    return "- " + " · ".join(parts)


def _period_label(teams, start: date, end: date) -> str:
    return f"{', '.join(teams)} ({start.strftime('%d/%m/%Y')} a {end.strftime('%d/%m/%Y')})"


def format_registered(issues, teams, start, end) -> str:
    out = [f"## Issues registradas — {_period_label(teams, start, end)}", "", f"**Total:** {len(issues)}", ""]
    if not issues:
        return "\n".join(out + ["Nenhuma issue registrada no período."])
    out.append(_chart("bar", "Issues registradas por pessoa", Counter(_first(i, ["Reg. by"]) for i in issues)))
    statuses = Counter(_first(i, STATUS_FIELDS) for i in issues)
    if len(statuses) > 1 or "" not in statuses:
        out.append(_chart("pie", "Status das issues", statuses))
    out.append(_chart("pie", "Região", Counter(i.get("Região (Backbone/LA)") for i in issues)))
    out += _issue_list(issues, closed=False)
    return "\n".join(out)


def format_closed(issues, teams, start, end) -> str:
    out = [f"## Issues fechadas — {_period_label(teams, start, end)}", "", f"**Total:** {len(issues)}"]
    if not issues:
        return "\n".join(out + ["", "Nenhuma issue com confirmação de resolução no período."])
    notes = Counter(i.get("Nota da correção", "Verificar") for i in issues)
    out.append("")
    for note in ("Good", "Neutral", "Bad", "Verificar"):
        if notes.get(note):
            out.append(f"- **{note}:** {notes[note]} ({notes[note] * 100 / len(issues):.1f}%)")
    out.append("")
    out.append(_chart("pie", "Nota da correção", notes))
    out.append(_chart("bar", "Issues fechadas por região", Counter(i.get("Região (Backbone/LA)") for i in issues)))
    out.append(_chart("bar", "Issues fechadas por pessoa", Counter(_first(i, ["Reg. by"]) for i in issues)))
    out += _issue_list(issues, closed=True)
    return "\n".join(out)


def _issue_list(issues, closed: bool):
    out = ["", "### Lista de issues", ""]
    out += [_issue_line(i, closed) for i in issues[:MAX_LIST_ITEMS]]
    if len(issues) > MAX_LIST_ITEMS:
        out.append(f"\n*Mostrando {MAX_LIST_ITEMS} de {len(issues)}. Informe um código de issue para ver os detalhes.*")
    return out


# --- Intenções -----------------------------------------------------------

def _handle_codes(codes, user_text, llm):
    blocks, found = [], []
    for code in codes[:MAX_CODES_PER_MESSAGE]:
        try:
            issue = plm_service.get_issue_by_code(code)
        except PLMError as e:
            blocks.append(f"## Issue {_safe(code)}\n\nNão consegui consultar o PLM: {_safe(e)}")
            continue
        if issue is None:
            blocks.append(f"## Issue {_safe(code)}\n\nIssue não encontrada no PLM.")
            continue
        found.append(issue)
        blocks.append(format_issue(issue))

    if len(codes) > MAX_CODES_PER_MESSAGE:
        blocks.append(f"*Foram consultadas apenas as {MAX_CODES_PER_MESSAGE} primeiras issues.*")

    if found and llm:
        analysis = llm([
            {
                "role": "system",
                "content": (
                    "Você é o assistente do SVP. Com base SOMENTE nos dados de issue do PLM abaixo, "
                    "responda à mensagem do usuário. Se ele apenas informou o código, faça uma análise curta "
                    "(3 a 5 tópicos): situação atual, classificação da correção e pontos de atenção. "
                    "Não repita todos os campos, não use tabelas e não invente dados. "
                    "Responda no idioma da mensagem do usuário.\n\nDADOS:\n"
                    + json.dumps(found, ensure_ascii=False, default=str)
                ),
            },
            {"role": "user", "content": user_text},
        ])
        if analysis:
            blocks.append("### Análise\n\n" + analysis.strip())

    return "\n\n---\n\n".join(blocks)


def _route(messages, llm):
    """Usa a IA para extrair ação, equipes e período. Retorna dict ou None."""
    history = [
        f"{m.get('role')}: {str(m.get('content', ''))[:500]}"
        for m in messages[-5:] if m.get("role") in ("user", "assistant")
    ]
    today = date.today()
    content = llm([
        {
            "role": "system",
            "content": (
                f"Hoje é {today.isoformat()}. Você classifica pedidos de consulta ao PLM (sistema de issues).\n"
                "Equipes: UIT, FOTA, Bixby, Compatibility, SVP (= UIT+Bixby+Compatibility), Todos.\n"
                "Responda APENAS um JSON, sem texto extra, no formato:\n"
                '{"action": "registered" | "closed" | "summary" | "none", "teams": ["..."], '
                '"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}\n'
                "- registered: issues registradas/abertas/reportadas no período.\n"
                "- closed: issues fechadas/resolvidas, nota da correção, modification rate.\n"
                "- summary: relatório geral ou registradas + fechadas.\n"
                "- none: a mensagem NÃO pede dados do PLM (dúvidas de processo, conceitos, conversa).\n"
                'Sem equipe mencionada use ["Todos"]. Sem período use do dia 1 do mês atual até hoje. '
                "Resolva períodos relativos (ex.: mês passado, última semana) a partir de hoje. "
                "Use o histórico para completar pedidos de continuação (ex.: \"e do FOTA?\")."
            ),
        },
        {"role": "user", "content": "\n".join(history)},
    ])
    if not content:
        return None
    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        return None
    try:
        route = json.loads(match.group(0))
        if route.get("action") not in ("registered", "closed", "summary"):
            return None
        start = date.fromisoformat(route["start"])
        end = date.fromisoformat(route["end"])
    except (ValueError, KeyError, TypeError):
        return None
    if start > end:
        start, end = end, start
    teams = plm_service.resolve_teams(route.get("teams") or ["Todos"]) or plm_service.TEAM_GROUPS["Todos"]
    return {"action": route["action"], "teams": teams, "start": start, "end": end}


def _handle_period(route):
    action, teams, start, end = route["action"], route["teams"], route["start"], route["end"]
    try:
        blocks = []
        if action in ("registered", "summary"):
            blocks.append(format_registered(plm_service.get_registered_issues(teams, start, end), teams, start, end))
        if action in ("closed", "summary"):
            blocks.append(format_closed(plm_service.get_closed_issues(teams, start, end), teams, start, end))
        return "\n\n---\n\n".join(blocks)
    except PLMError as e:
        return f"Não consegui consultar o PLM: {_safe(e)}"


def handle(messages, llm=None):
    """
    messages: histórico do chat (último item = mensagem atual do usuário).
    llm: função (messages) -> str | None, usada para análise e roteamento.
    """
    if not messages:
        return None
    user_text = str(messages[-1].get("content", ""))

    codes = plm_service.find_case_codes(user_text)
    if codes:
        return _handle_codes(codes, user_text, llm)

    if llm and INTENT_TRIGGER_RE.search(user_text):
        route = _route(messages, llm)
        if route:
            return _handle_period(route)
    return None
