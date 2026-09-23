"""
Cliente PLM para uso como biblioteca (ex.: chat do SVP no server.py).

Mesma API usada por plm_general.py / main.py, mas:
- sem menu interativo e sem depender do diretório de execução (caminhos absolutos);
- token cacheado e renovado automaticamente;
- período recebido por parâmetro (não lê data.txt).
"""
import os
import re
import threading
import time
from datetime import date, datetime, timedelta

import requests

from .aux_functions import folderStage, modificationRate

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PLM_HOST = os.environ.get("PLM_HOST", "http://105.112.150.108:105").rstrip("/")
REQUEST_TIMEOUT = 60
TOKEN_TTL = 30 * 60  # segundos

TEAM_FILES = {
    "UIT": "inputUIT.txt",
    "FOTA": "inputFOTA.txt",
    "Bixby": "inputBixby.txt",
    "Compatibility": "inputCompatibility.txt",
}
# Mesmos agrupamentos do menu do main.py
TEAM_GROUPS = {
    "SVP": ["UIT", "Bixby", "Compatibility"],
    "Todos": ["UIT", "Bixby", "Compatibility", "FOTA"],
}
# Arquivos usados só para localizar uma issue pelo código (cobrem todo o time)
LOOKUP_FILES = list(TEAM_FILES.values()) + ["inputSVP.txt", "inputatualizado.txt"]

# Ex.: P250702-00437 -> registrada em 2025-07-02
CASE_CODE_RE = re.compile(r"\b([A-Z])(\d{2})(\d{2})(\d{2})-(\d{4,6})\b", re.IGNORECASE)

ISSUE_STATUSES = "OPEN,RESOLVE,CLOSE"

_session = requests.Session()
_token_lock = threading.Lock()
_token_cache = {"token": None, "expires": 0.0}


class PLMError(Exception):
    pass


# --- Credenciais / login -------------------------------------------------

def _credentials():
    user = os.environ.get("PLM_USER")
    password = os.environ.get("PLM_PASSWORD")
    if user and password:
        return user, password
    login_file = os.path.join(BASE_DIR, "login.txt")
    if os.path.exists(login_file):
        lines = _read_lines(login_file)
        if len(lines) >= 2:
            return lines[0], lines[1]
    raise PLMError("Credenciais do PLM não configuradas (PLM_USER/PLM_PASSWORD ou plm_api/login.txt).")


def _login():
    user, password = _credentials()
    try:
        res = requests.post(
            f"{PLM_HOST}/auth/login",
            data={"username": user, "password": password},
            timeout=REQUEST_TIMEOUT,
        )
        res.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise PLMError(f"Falha no login do PLM: {e}")
    # A API devolve o token entre aspas
    return res.text.strip().replace('"', "")


def _get_token(force=False):
    with _token_lock:
        if force or not _token_cache["token"] or time.time() >= _token_cache["expires"]:
            _token_cache["token"] = _login()
            _token_cache["expires"] = time.time() + TOKEN_TTL
        return _token_cache["token"]


def _post_issues(params: dict):
    """POST /plm/issues com renovação de token em caso de 401. Retorna a lista de issues."""
    for attempt in range(2):
        token = _get_token(force=attempt > 0)
        try:
            res = _session.post(
                f"{PLM_HOST}/plm/issues",
                json=params,
                headers={"Authorization": f"Bearer {token}"},
                timeout=REQUEST_TIMEOUT,
            )
        except requests.exceptions.RequestException as e:
            raise PLMError(f"Falha ao consultar o PLM: {e}")
        if res.status_code in (401, 403) and attempt == 0:
            continue
        if not res.ok:
            raise PLMError(f"PLM respondeu {res.status_code}: {res.text[:300]}")
        try:
            payload = res.json()
        except ValueError:
            raise PLMError("Resposta inválida do PLM (não é JSON).")
        return (payload or {}).get("data") or []
    return []


# --- Arquivos de IDs -----------------------------------------------------

def _read_lines(path: str):
    with open(path, encoding="utf-8-sig") as f:
        return [re.sub(r"\s+", "", line) for line in f if line.strip()]


def _ids_from_files(files):
    ids = []
    for name in files:
        path = os.path.join(BASE_DIR, name)
        if os.path.exists(path):
            ids.extend(_read_lines(path))
    return ";".join(dict.fromkeys(ids))  # remove duplicados mantendo a ordem


def resolve_teams(teams):
    """Normaliza nomes de equipes (aceita grupos SVP/Todos, sem diferenciar maiúsculas)."""
    lookup = {k.lower(): k for k in list(TEAM_FILES) + list(TEAM_GROUPS)}
    result = []
    for t in teams or []:
        key = lookup.get(str(t).strip().lower())
        if not key:
            continue
        for team in TEAM_GROUPS.get(key, [key]):
            if team not in result:
                result.append(team)
    return result


# --- Helpers -------------------------------------------------------------

def _parse_dt(value):
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace(".", "-"))
    except ValueError:
        return None


def _classify(issue: dict):
    folder = issue.get("Dev. Mdl. Name/Item Name") or ""
    issue["Região (Backbone/LA)"] = folderStage(folder)
    if issue.get("Resolve Option(Medium)") or issue.get("Resolve Option(Small)"):
        issue["Nota da correção"] = modificationRate(
            folder, issue.get("Resolve Option(Medium)") or "", issue.get("Resolve Option(Small)") or ""
        )
    return issue


def find_case_codes(text: str):
    return list(dict.fromkeys(m.group(0).upper() for m in CASE_CODE_RE.finditer(text or "")))


# --- API pública ---------------------------------------------------------

def get_issue_by_code(case_code: str):
    """
    Busca uma issue pelo Case Code. A data de registro vem do próprio código
    (P250702-00437 -> 2025-07-02), então consulta só aquele dia e filtra pelo código.
    Retorna o dict da issue (com Região e Nota calculadas) ou None.
    """
    m = CASE_CODE_RE.fullmatch(case_code.strip())
    if not m:
        raise PLMError(f"Código de issue inválido: {case_code}")
    code = m.group(0).upper()
    try:
        day = date(2000 + int(m.group(2)), int(m.group(3)), int(m.group(4)))
    except ValueError:
        raise PLMError(f"Código de issue com data inválida: {case_code}")

    base = {
        "registerStartDate": day.isoformat(),
        "registerEndDate": (day + timedelta(days=1)).isoformat(),
        "progressStatus": ISSUE_STATUSES,
    }
    # 1ª tentativa: restrito às pessoas do time; 2ª: qualquer registrante daquele dia
    attempts = [{**base, "registerId": _ids_from_files(LOOKUP_FILES)}, base]
    for params in attempts:
        for issue in _post_issues(params):
            if str(issue.get("Case Code", "")).strip().upper() == code:
                return _classify(issue)
    return None


def get_registered_issues(teams, start: date, end: date):
    """Issues registradas no período (OPEN, RESOLVE, CLOSE) das equipes informadas."""
    teams = resolve_teams(teams)
    if not teams:
        raise PLMError("Nenhuma equipe válida informada.")
    issues = _post_issues({
        "registerStartDate": start.isoformat(),
        "registerEndDate": end.isoformat(),
        "registerId": _ids_from_files(TEAM_FILES[t] for t in teams),
        "progressStatus": ISSUE_STATUSES,
    })
    return [_classify(i) for i in issues if i.get("Registered Date")]


def get_closed_issues(teams, start: date, end: date):
    """Issues fechadas cuja confirmação de resolução caiu no período, com Região e Nota."""
    teams = resolve_teams(teams)
    if not teams:
        raise PLMError("Nenhuma equipe válida informada.")
    issues = _post_issues({
        "resolveStartDate": start.strftime("%Y.%m.%d"),
        "resolvedEndDate": (end + timedelta(days=1)).strftime("%Y.%m.%d"),
        "registerId": _ids_from_files(TEAM_FILES[t] for t in teams),
        "progressStatus": "CLOSE",
    })
    start_dt = datetime.combine(start, datetime.min.time())
    end_dt = datetime.combine(end, datetime.max.time())
    result = []
    for i in issues:
        confirm = _parse_dt(i.get("Resloved Confirm Date"))
        if confirm and start_dt <= confirm <= end_dt:
            result.append(_classify(i))
    return result
