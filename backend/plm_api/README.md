# SVP Issues Report

Ferramenta em Python que busca issues no servidor **PLM**, filtra pelas equipes e pelo período desejado, classifica cada issue e gera um relatório Excel usado no Power BI.

Este documento explica como a ferramenta funciona e **o que copiar para levá-la para outro sistema**.

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Como funciona, passo a passo](#2-como-funciona-passo-a-passo)
3. [O que cada arquivo faz](#3-o-que-cada-arquivo-faz)
4. [Regras de classificação](#4-regras-de-classificação)
5. [Integração em outro sistema (Python)](#5-integração-em-outro-sistema-python)
6. [Integração em outro sistema (qualquer linguagem, via API)](#6-integração-em-outro-sistema-qualquer-linguagem-via-api)
7. [Uso standalone (menu no terminal)](#7-uso-standalone-menu-no-terminal)
8. [Gerar o executável (.exe)](#8-gerar-o-executável-exe)
9. [Problemas conhecidos e cuidados](#9-problemas-conhecidos-e-cuidados)

---

## 1. Visão geral

```
main.py ──► plm_general.py ──► servidor PLM (HTTP)
   │            └─ settings.py (endereço do servidor)
   ├──► aux_functions.py   (lê os .txt e classifica as issues)
   └──► excel_general.py   (grava o .xlsx em Historic/)
```

**Entrada:** listas de IDs de pessoas por equipe (`input*.txt`), período (`data.txt`) e credenciais (`login.txt`).
**Saída:** `Historic/Report_PowerBI_issues<AAAA-MM-DD>_<h>-<m>-<s>.xlsx`, com duas abas:

| Aba | Conteúdo |
|---|---|
| `issueClose` | Issues **fechadas** cuja confirmação de resolução caiu dentro do período, com região e nota de correção |
| `issueRegister` | Issues **registradas** dentro do período |

---

## 2. Como funciona, passo a passo

1. **Login:** envia usuário e senha para `POST /auth/login` e recebe um token.
2. **Equipes:** para cada equipe escolhida, lê os IDs do `input<Equipe>.txt` e junta todos com `;`.
3. **Issues fechadas** (`closeTat`):
   - busca em `/plm/issues` as issues com status `CLOSE` resolvidas de **01/11/2025 até amanhã**;
   - mantém só as que têm `Resloved Confirm Date` dentro do período do `data.txt`;
   - para cada uma, calcula a **região** (`folderStage`) e a **nota** (`modificationRate`).
4. **Issues registradas** (`register`): busca em `/plm/issues` as issues com status `OPEN`, `RESOLVE` ou `CLOSE` registradas dentro do período do `data.txt`.
5. **Excel:** junta as duas listas e grava a planilha em `Historic/`.

---

## 3. O que cada arquivo faz

### Código

| Arquivo | Função |
|---|---|
| `main.py` | Mostra o menu de equipes e coordena todo o fluxo (`closeTat`, `register` e a exportação). **Pede input ao ser importado, então não serve para importar como biblioteca** (ver seção 5). |
| `plm_general.py` | Classe `PLM`, que conversa com o servidor: `login`, `get_issues` (registradas), `get_powerbi_issues` (fechadas) e `get_close_issues` (legado). |
| `aux_functions.py` | Leitura dos `.txt` (`read_txt`, `read_model`) e regras de classificação (`folderStage`, `modificationRate`). |
| `excel_general.py` | Classe `Excel`, cujo `export(fechadas, registradas)` grava o `.xlsx` com as duas abas. |
| `settings.py` | Endereço do servidor (`PLM_HOST`). Pode ser trocado por um arquivo `.env`. |

### Dados e configuração

| Arquivo | Formato | Observação |
|---|---|---|
| `inputUIT.txt`, `inputFOTA.txt`, `inputBixby.txt`, `inputCompatibility.txt` | um ID do PLM por linha | Define de quem são as issues buscadas |
| `inputSVP.txt`, `inputatualizado.txt` | um ID por linha | Hoje não são lidos pelo código |
| `data.txt` | linha 1 = início, linha 2 = fim (`AAAA-MM-DD`) | Período do relatório. **É lido por dentro do `plm_general.py`** |
| `login.txt` | linha 1 = usuário, linha 2 = senha | Credenciais do PLM, em texto puro |
| `.env` (opcional) | `PLM_HOST=http://ip:porta` | Troca o servidor sem mexer no código |
| `requirements.txt` | — | Dependências |

> Todos os `.txt` são lidos por **caminho relativo**, ou seja, a partir da pasta de onde o programa é executado. Os espaços em branco das linhas são removidos.

---

## 4. Regras de classificação

### Região (`folderStage`), a partir de `Dev. Mdl. Name/Item Name`

As regras são avaliadas na ordem abaixo; a primeira que bater define o resultado.

| Condição | Resultado |
|---|---|
| Sem `[` e sem `)` no nome, e contém `LA` | `Main Folder - LA` |
| Sem `[` e sem `)` no nome | `Main Folder - BB` |
| Não contém `SM-` | `App folder` |
| Contém `for Next SW` ou `MMI` | `App folder` |
| Qualquer outro caso | `MR` |

### Nota da correção (`modificationRate`)

| Resultado | Quando |
|---|---|
| **Good** | Medium = `Issue Fixed(Source changes)`, `Issue Fixed(Except Source changes)` ou `App Update via App Store` |
| **Neutral** | Medium = `Not reproduced`, `Maintain current status`, `Request to 3rd Party(Non Samsung Issue)` ou `Duplicated issue(Cause side)` |
| **Bad** | Medium = `Insufficient Defect Info.` |
| **Bad** | Medium = `Not problem` e Small = `A test error/mistake` |
| **Neutral** | Small = `Carrier Requirement` ou `Intentional operation/Phenomenon/Unsupported` |
| **Neutral** | Small = `Product Requirement, UX Guide, Standard Technical Specification` em Main Folder (sem `[` e sem `)`) |
| **Bad** | Small = `Product Requirement, UX Guide, Standard Technical Specification` nos demais casos |
| **Verificar** | Nenhuma das regras acima |

---

## 5. Integração em outro sistema (Python)

### 5.1 Requisitos
- **Python 3.11** (mínimo 3.10, por causa do `match`).
- Acesso de rede ao servidor PLM (`105.112.150.108:105`). O servidor só é acessível pela rede interna.

### 5.2 O que copiar

Copie estes arquivos para uma pasta do outro sistema (por exemplo, `svp_issues/`):

```
svp_issues/
├── plm_general.py          ← copiar
├── aux_functions.py        ← copiar
├── excel_general.py        ← copiar (só se for gerar Excel)
├── settings.py             ← copiar
├── inputUIT.txt            ← copiar
├── inputFOTA.txt           ← copiar
├── inputBixby.txt          ← copiar
├── inputCompatibility.txt  ← copiar
├── data.txt                ← copiar (ou criar com o período)
├── Historic/               ← criar a pasta vazia (só se for gerar Excel)
└── relatorio_issues.py     ← CRIAR com o código da seção 5.4
```

**Não copie:** `main.py` (tem o menu interativo), `deploy.py`, `main.spec`, `releases/`, os relatórios do `Historic/` nem o `login.txt` (passe as credenciais por variável de ambiente ou pelo cofre de segredos do sistema).

### 5.3 Instalar as dependências

Adicione ao `requirements.txt` do outro sistema:

```
requests==2.32.3
pandas==2.0.3
numpy==1.26.4
XlsxWriter==3.2.0
pydantic==2.9.2
pydantic-settings==2.6.0
python-dotenv==1.0.1
```

e rode `pip install -r requirements.txt`.

### 5.4 Criar `relatorio_issues.py`

Este arquivo substitui o `main.py`: faz o mesmo processamento, mas **sem menu**, recebendo tudo por parâmetro e devolvendo as listas. Ele reaproveita os outros arquivos sem nenhuma alteração.

```python
"""
Ponto de entrada do SVP Issues Report para uso como biblioteca.
Mesmo processamento do main.py, sem o menu interativo.
"""
import os
from datetime import datetime

from plm_general import PLM
from aux_functions import read_txt, read_model, folderStage, modificationRate
from excel_general import Excel

EQUIPES = {
    "UIT": "inputUIT.txt",
    "FOTA": "inputFOTA.txt",
    "Bixby": "inputBixby.txt",
    "Compatibility": "inputCompatibility.txt",
}


def _to_date(value):
    return datetime.fromisoformat(value) if value else value


def _issues(response):
    # A API devolve {"data": [...]}; em caso de erro as funções do PLM devolvem None
    return (response or {}).get("data") or []


def gerar_relatorio(equipes, usuario, senha, exportar_excel=True):
    """
    equipes: lista com nomes de EQUIPES, ex.: ["UIT", "FOTA"]
    Período: lido do data.txt (linha 1 = início, linha 2 = fim).
    Retorna (fechadas, registradas), duas listas de dicionários.
    """
    plm = PLM()
    token = plm.login(usuario, senha).replace('"', "")

    inicio, fim = (datetime.fromisoformat(d) for d in read_model("data.txt")[:2])

    fechadas, registradas = [], []
    for equipe in equipes:
        ids = read_txt(EQUIPES[equipe])

        # Issues fechadas com confirmação dentro do período
        for i in _issues(plm.get_powerbi_issues(ids, token)):
            confirm = i["Resloved Confirm Date"]
            if not confirm or not (inicio <= datetime.fromisoformat(confirm) <= fim):
                continue
            folder = i["Dev. Mdl. Name/Item Name"]
            fechadas.append(
                {
                    "case_code": i["Case Code"],
                    "Dev. Mdl. Name/Item Name": folder,
                    "Backbone/LA": folderStage(folder),
                    "reg": i["Reg. by"],
                    "reg_id": i["Reg. by ID"],
                    "Resolve Option(Medium)": i["Resolve Option(Medium)"],
                    "Resolve Option(Small)": i["Resolve Option(Small)"],
                    "Modification rate": modificationRate(
                        folder, i["Resolve Option(Medium)"], i["Resolve Option(Small)"]
                    ),
                    "Registered Date": _to_date(i["Registered Date"]),
                    "S/W Ver.(Date)": _to_date(i["S/W Ver.(Date)"]),
                    "Resolve Date": _to_date(i["Resolve Date"]),
                    "Resolve confirmer ID": i["Resolve confirmer ID"],
                    "Resloved Confirm Date": _to_date(confirm),
                    "Resolution Confirmation S/W Ver.(Date)": _to_date(
                        i["Resolution Confirmation S/W Ver.(Date)"]
                    ),
                    "Close Option": i["Close Option"],
                    "title": i["Title"],
                }
            )

        # Issues registradas dentro do período
        for i in _issues(plm.get_issues(ids, token)):
            if i["Registered Date"]:
                registradas.append(
                    {
                        "case_code": i["Case Code"],
                        "Dev. Mdl. Name/Item Name": i["Dev. Mdl. Name/Item Name"],
                        "Reg. by": i["Reg. by"],
                        "Reg. by ID": i["Reg. by ID"],
                        "Registered Date": datetime.fromisoformat(i["Registered Date"]),
                        "Title": i["Title"],
                    }
                )

    if exportar_excel:
        os.makedirs("Historic", exist_ok=True)
        Excel().export(fechadas, registradas)

    return fechadas, registradas


if __name__ == "__main__":
    gerar_relatorio(
        ["UIT", "Bixby", "Compatibility", "FOTA"],
        os.environ["PLM_USER"],
        os.environ["PLM_PASSWORD"],
    )
```

### 5.5 Usar no outro sistema

```python
import os
from relatorio_issues import gerar_relatorio

fechadas, registradas = gerar_relatorio(
    ["UIT", "FOTA"],
    usuario=os.environ["PLM_USER"],
    senha=os.environ["PLM_PASSWORD"],
    exportar_excel=False,   # True para também gravar o .xlsx em Historic/
)
# fechadas e registradas são listas de dicts: dá para salvar em banco,
# devolver numa API, montar um DataFrame etc.
```

**Importante:** execute a partir da pasta `svp_issues/`, ou faça `os.chdir("caminho/svp_issues")` antes, porque os `.txt` e o `Historic/` são lidos por caminho relativo.

Equivalência com o menu do `main.py`:

| Menu | Chamada |
|---|---|
| 1 UIT | `["UIT"]` |
| 2 FOTA | `["FOTA"]` |
| 3 Bixby | `["Bixby"]` |
| 4 Compatibility | `["Compatibility"]` |
| 5 SVP | `["UIT", "Bixby", "Compatibility"]` |
| 6 Todos | `["UIT", "Bixby", "Compatibility", "FOTA"]` |

---

## 6. Integração em outro sistema (qualquer linguagem, via API)

Se o outro sistema não for em Python, basta reproduzir as chamadas HTTP abaixo e aplicar as regras da [seção 4](#4-regras-de-classificação).

**Base:** `http://105.112.150.108:105`

### Login
```
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=<usuario>&password=<senha>
```
A resposta é o token em texto, **entre aspas**. Remova as aspas antes de usar.

### Buscar issues
```
POST /plm/issues
Authorization: Bearer <token>
Content-Type: application/json
```

Corpo para **issues registradas**:
```json
{
  "registerStartDate": "2026-07-30",
  "registerEndDate": "2026-09-01",
  "registerId": "ID1;ID2;ID3",
  "progressStatus": "OPEN,RESOLVE,CLOSE"
}
```

Corpo para **issues fechadas** (depois, filtrar por `Resloved Confirm Date` dentro do período):
```json
{
  "resolveStartDate": "2025.11.01",
  "resolvedEndDate": "<amanhã, AAAA.MM.DD>",
  "registerId": "ID1;ID2;ID3",
  "progressStatus": "CLOSE"
}
```

> Os nomes dos campos são exatamente esses, inclusive `resolvedEndDate` (com "d") e `Resloved Confirm Date` (grafia errada, que vem da própria API).

**Resposta:** `{"data": [ {...}, ... ]}`. Campos usados de cada issue:

`Case Code`, `Dev. Mdl. Name/Item Name`, `Reg. by`, `Reg. by ID`, `Title`, `Registered Date`, `Resolve Option(Medium)`, `Resolve Option(Small)`, `S/W Ver.(Date)`, `Resolve Date`, `Resolve confirmer ID`, `Resloved Confirm Date`, `Resolution Confirmation S/W Ver.(Date)`, `Close Option`.

As datas vêm no formato ISO (`AAAA-MM-DD HH:MM:SS`) ou vazias.

---

## 7. Uso standalone (menu no terminal)

```
pip install -r requirements.txt
python main.py
```

1. Ajuste o período no `data.txt`.
2. Preencha o `login.txt` (usuário na 1ª linha, senha na 2ª).
3. Rode o programa e escolha a equipe (1 a 6).
4. Pegue a planilha em `Historic/`.

---

## 8. Gerar o executável (.exe)

```
pip install pyinstaller==6.7.0
pyinstaller main.spec
```

O `.exe` sai em `dist/main.exe`. Ele precisa ficar numa pasta junto com os `input*.txt`, o `data.txt`, o `login.txt` e uma pasta `Historic/`.

> O `deploy.py` está desatualizado (versão 1.1.0 e caminhos de outra máquina). Não use.

---

## 9. Problemas conhecidos e cuidados

- **Credenciais:** o `login.txt` guarda a senha em texto puro, e o `plm_general.py` tem credenciais antigas comentadas (linhas 12-13). No outro sistema, use variáveis de ambiente ou um cofre de segredos.
- **URL de login fixa:** o `login` usa `http://105.112.150.108:105` escrito no código e não lê `settings.PLM_HOST`. Se o servidor mudar, altere os dois lugares.
- **Data inicial fixa:** `get_powerbi_issues` sempre busca a partir de `2025.11.01`.
- **`data.txt` acoplado:** `get_issues` lê o `data.txt` por dentro, sem receber o período por parâmetro.
- **Um login por chamada no `main.py`:** na opção 6 são feitos 8 logins. O `relatorio_issues.py` faz só um.
- **Erros de rede:** no `main.py`, uma falha na API quebra o programa com `TypeError`. O `relatorio_issues.py` trata isso e devolve listas vazias.
- **numpy:** o `main.py` importa `numpy._typing._VoidCodes`, uma API privada. Mantenha `numpy==1.26.4` ou remova esse import.
