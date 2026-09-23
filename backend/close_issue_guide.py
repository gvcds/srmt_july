"""
Base de conhecimento RAG — Close Issue Guide 1.4

Fonte da verdade: knowledge_base/Close_Issue_Guide_1.4_RAG_Tester_Approach.md
Cada "## CASE ID" do guia é uma unidade independente de recuperação.
Para editar respostas/regras, altere apenas o arquivo .md — este módulo faz o
parse, busca os casos relevantes para a pergunta e monta o bloco de contexto
que é injetado no system prompt do chat (/ai/analyze).
"""
import math
import os
import re
import unicodedata

GUIDE_FILENAME = "Close_Issue_Guide_1.4_RAG_Tester_Approach.md"
GUIDE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "knowledge_base", GUIDE_FILENAME)

STOPWORDS = {
    # en
    "the", "and", "for", "with", "what", "which", "should", "this", "that", "issue", "issues", "have", "has",
    "are", "was", "from", "take", "use", "my", "as", "is", "an", "to", "of", "in", "on", "or", "it", "if", "do", "don",
    "option", "resolve", "resolved", "close", "tester", "developer", "dev", "action", "medium", "small",
    # pt
    "que", "minha", "meu", "uma", "como", "para", "por", "com", "devo", "fazer", "posso", "qual", "quando",
    "esta", "está", "foi", "dos", "das", "nao", "não", "sim", "mas", "isso", "ele", "ela", "resolveu", "fechar",
}


# ---------- Parse ----------

def _unquote(s):
    return s.strip().strip("`").strip()


def _field(block, label):
    m = re.search(rf"^-\s*\*\*{label}:\*\*\s*(.+)$", block, re.IGNORECASE | re.MULTILINE)
    return _unquote(m.group(1)) if m else ""


def _section(block, heading):
    m = re.search(rf"^###\s*{heading}\s*$(.*?)(?=^###\s|\Z)", block, re.IGNORECASE | re.MULTILINE | re.DOTALL)
    return m.group(1).strip() if m else ""


def parse_guide(markdown):
    text = markdown.replace("\r\n", "\n")
    parts = re.split(r"^(?=## CASE ID:)", text, flags=re.MULTILINE)

    rules = re.sub(r"^#\s.*$", "", parts[0], count=1, flags=re.MULTILINE).strip()
    cases = []
    for raw in parts[1:]:
        m = re.search(r"^## CASE ID:\s*(\S+)", raw, re.MULTILINE)
        cases.append({
            "id": m.group(1) if m else "UNKNOWN",
            "resolve_medium": _field(raw, r"Resolve option \(Medium\)"),
            "resolve_small": _field(raw, r"Resolve Option \(Small\)"),
            "close_option": _unquote(_section(raw, "Close option")),
            "keywords": [k.strip() for k in _section(raw, "Keywords").split(",") if k.strip()],
            # Bloco markdown completo do caso, enviado literalmente ao modelo
            "raw": raw.strip(),
        })
    return {"rules": rules, "cases": cases}


# ---------- Índice (BM25 + frases exatas) ----------

def _normalize(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    s = re.sub(r"[^a-z0-9/_.\s-]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def _tokenize(s):
    return [t for t in re.split(r"[\s/_.-]+", _normalize(s)) if len(t) > 2 and t not in STOPWORDS]


def _build_index(knowledge):
    items = []
    for c in knowledge["cases"]:
        tokens = _tokenize(c["raw"])
        tf = {}
        for t in tokens:
            tf[t] = tf.get(t, 0) + 1

        # Opções de resolve/close valem mais que keywords soltas
        phrases = [(c["resolve_small"], 12)]
        phrases += [(s, 8) for s in c["resolve_small"].split(",")]
        phrases += [(c["resolve_medium"], 6), (c["close_option"], 4)]
        phrases += [(k, 3 if " " in k else 1) for k in c["keywords"]]
        phrases = [(_normalize(p), w) for p, w in phrases]
        phrases = [(p, w) for p, w in phrases if len(p) >= 4 and p != "n/a" and p not in STOPWORDS]

        items.append({"case": c, "tf": tf, "length": len(tokens), "phrases": phrases})

    df = {}
    for it in items:
        for t in it["tf"]:
            df[t] = df.get(t, 0) + 1
    n = len(items)
    idf = {t: math.log(1 + (n - k + 0.5) / (k + 0.5)) for t, k in df.items()}
    avg_len = sum(it["length"] for it in items) / max(n, 1)
    return {"items": items, "idf": idf, "avg_len": avg_len}


_cache = {"mtime": None, "knowledge": None, "index": None}


def load_guide():
    """Lê, faz parse e indexa o guia; recarrega automaticamente se o .md for alterado."""
    mtime = os.path.getmtime(GUIDE_PATH)
    if _cache["mtime"] != mtime:
        with open(GUIDE_PATH, "r", encoding="utf-8") as f:
            knowledge = parse_guide(f.read())
        _cache.update(mtime=mtime, knowledge=knowledge, index=_build_index(knowledge))
    return _cache["knowledge"], _cache["index"]


def _score_cases(query, index):
    nq = f" {_normalize(query)} "
    q_tokens = set(_tokenize(query))
    idf, avg_len = index["idf"], index["avg_len"]

    ranked = []
    for it in index["items"]:
        bm25 = 0.0
        for t in q_tokens:
            f = it["tf"].get(t)
            if f:
                bm25 += idf.get(t, 0) * (f * 2.2) / (f + 1.2 * (0.25 + 0.75 * it["length"] / avg_len))
        phrase = sum(w for p, w in it["phrases"] if f" {p} " in nq or (" " in p and p in nq))
        direct = 50 if _normalize(it["case"]["id"]) in nq else 0
        ranked.append((bm25 + phrase + direct, it["case"]))
    ranked.sort(key=lambda r: r[0], reverse=True)
    return ranked


def _catalog(knowledge):
    """Índice compacto de todos os casos — permite respostas gerais e desambiguação."""
    return "\n".join(
        f"- {c['id']} | Medium: {c['resolve_medium']} | Small: {c['resolve_small']} | Close option: {c['close_option']}"
        for c in knowledge["cases"]
    )


def retrieve_context(query, max_cases=4):
    """Retorna (case_ids, contexto) com os casos do guia mais relevantes para a pergunta."""
    knowledge, index = load_guide()
    ranked = _score_cases(query, index)
    top = ranked[0][0] if ranked else 0

    selected = [] if top < 2 else [c for s, c in ranked if s >= max(2, top * 0.4)][:max_cases]

    if selected:
        retrieved = "### CASOS RECUPERADOS (use como fonte principal da resposta)\n\n" + \
            "\n\n---\n\n".join(c["raw"] for c in selected)
    else:
        retrieved = ("### CASOS RECUPERADOS\nNenhum caso específico foi identificado para esta pergunta. "
                     "Use o catálogo acima ou peça ao usuário o Resolve option (Medium) e o Resolve Option (Small).")

    context = "\n\n".join([
        f"### REGRAS DO GUIA\n{knowledge['rules']}",
        f"### CATÁLOGO DE CASOS (Resolve option → Close option)\n{_catalog(knowledge)}",
        retrieved,
    ])
    return [c["id"] for c in selected], context


def build_prompt(messages):
    """
    Monta o bloco do system prompt com as regras de uso e o contexto do guia.
    Usa as últimas perguntas do usuário para que perguntas de acompanhamento
    ("e se não estiver corrigida?") continuem ligadas ao caso anterior.
    Retorna "" se o guia não estiver disponível — o chat segue funcionando sem ele.
    """
    user_msgs = [str(m.get("content", "")) for m in messages if m.get("role") == "user"]
    query = "\n".join(user_msgs[-3:])
    if not query.strip():
        return ""
    try:
        _, context = retrieve_context(query)
    except Exception as e:
        print(f"Erro ao carregar Close Issue Guide: {e}")
        return ""

    return f"""

BASE DE CONHECIMENTO OFICIAL — CLOSE ISSUE GUIDE 1.4 (PLM / fechamento de issues pelo tester):
- Para qualquer pergunta sobre resolve de issue, Resolve option (Medium/Small), Tester Approach, Close option, reject/reopen, Modification rate, evidências ou comentários padrão, o conteúdo abaixo é a FONTE DE VERDADE e tem prioridade sobre qualquer outro conhecimento.
- NUNCA invente, altere, resuma de forma que mude o sentido, ou combine ações e Close options diferentes das definidas no guia. Informe o Close option EXATAMENTE como está escrito (ex.: `Not Fixed_Ireproducibility`), assim como nomes de campos e status do PLM (ex.: `Resolution Confirmation S/W Ver.`, `Resolve - Released`), sem traduzi-los.
- Quando existir um "Example question" parecido com a pergunta do usuário, siga a "Answer" correspondente. Comentários padrão (ex.: "Dear all, Checked in release XXX...") devem ser reproduzidos literalmente, em bloco de código, sem tradução.
- Sempre que responder com base no guia, indique o(s) CASE ID(s) usados (ex.: "Fonte: Close Issue Guide 1.4 — CIG-015").
- Se a pergunta for ambígua (vários casos possíveis com ações ou Close options diferentes), pergunte ao usuário qual é o Resolve option (Medium) e o Resolve Option (Small), ou apresente as alternativas separadas por caso.
- Se o guia não cobrir a pergunta, diga claramente que a informação não consta no Close Issue Guide 1.4.
- Perguntas sem relação com fechamento de issues devem ser respondidas normalmente, ignorando esta base.

<close_issue_guide>
{context}
</close_issue_guide>"""
