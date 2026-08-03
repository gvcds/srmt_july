import os
import json
import warnings

import requests
from requests.exceptions import RequestException

# -------------------------------------------------
# 1️⃣ Configurações
# -------------------------------------------------
proxy_url = "https://ollama-api.sidia.org.br/api/chat/completions"

# A chave deve ser armazenada de forma segura, por exemplo:
# export OLLAMA_API_KEY="sk-xxxx..."
api_key = 'sk-9a088a9b29ae49f183b5e5c59a18a735'
if not api_key:
    raise RuntimeError("Variável de ambiente OLLAMA_API_KEY não encontrada.")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
}

data = {
    "model": "gpt-oss:20b",
    "messages": [
        {"role": "user", "content": "Explain quantum computing simply."}
    ],
    "stream": False,
}

# -------------------------------------------------
# 2️⃣ Opcional: suprimir o *InsecureRequestWarning* (não recomendado!)
# -------------------------------------------------
# Se o servidor usa certificado auto‑assinado, a forma correta é
#   1. instalar o certificado no trust store do seu sistema ou
#   2. apontar `verify='/caminho/para/certificado.pem'`
#   3. ou, como último recurso, desativar a verificação **apenas** para
#      aquele request e avisar o usuário.
warnings.filterwarnings("ignore", message="Unverified HTTPS request")

# -------------------------------------------------
# 3️⃣ Faz a chamada e trata a resposta
# -------------------------------------------------
try:
    response = requests.post(
        proxy_url,
        headers=headers,
        json=data,          # usa o parâmetro `json` (requests já faz json.dumps)
        verify=False,      # <-- aqui você pode colocar o caminho do .pem ou True
        timeout=30
    )
except RequestException as exc:
    raise SystemExit(f"❌ Falha ao conectar à API: {exc}")

# -------------------------------------------------
# 4️⃣ Checa o status HTTP
# -------------------------------------------------
if response.status_code != 200:
    print(f"❌ Erro HTTP {response.status_code}")
    print(response.text)
    response.raise_for_status()   # opcional: levanta exceção

# -------------------------------------------------
# 5️⃣ Analisa o JSON retornado
# -------------------------------------------------
payload = response.json()

# Debug: mostra a estrutura completa (remova em produção)
print("\n🔎 Payload bruto:")
print(json.dumps(payload, indent=2, ensure_ascii=False))

# -------------------------------------------------
# 6️⃣ Extrai o conteúdo da resposta
# -------------------------------------------------
if "error" in payload:
    err = payload["error"]
    raise SystemExit(f"❗ Erro da API: {err.get('message', 'sem mensagem')}")

try:
    # Formato padrão OpenAI
    content = payload["choices"][0]["message"]["content"]
except (KeyError, IndexError) as exc:
    raise SystemExit(f"⚠️ Estrutura inesperada da resposta: {exc}")

print("\n🤖 Resposta da IA:")
print(content)