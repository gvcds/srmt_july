import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
import json
import logging

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURAÇÃO DO BD ---
DB_CONFIG = {
    "dbname": "stms_tool_bd",
    "user": "postgres",
    "password": "SUA_SENHA_AQUI",  # <--- COLOQUE SUA SENHA DO POSTGRES
    "host": "localhost",
    "port": "5432"
}

# ==============================================================================
# ⚠️ CONFIGURAÇÃO DA API SAMSUNG ⚠️
# ==============================================================================

# 1. URL EXATA que você informou (Endpoint Pessoal/Trial)
API_URL = "https://genai-openapi.sec.samsung.net/lahq/trial/api-chat"

# 2. SEUS DADOS (Preencha com cuidado)
# Copiei as chaves do seu arquivo automacao_stms.py para facilitar
CLIENT_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IjQwZmJmNjY0LTlkNDEtNDcyZC1hNDI3LTQ3YmUxNTI2ZDc5ZC0zNDk1IiwiY2xpZW50U2VjcmV0IjoicHZoUGNzcWZUdUllN01BTzVYSm1yUHI3c1k1bzUyRkYiLCJleHAiOjE3NzgyNTIzOTl9.6bB_6mQsn_j0qagEdnu-JmACmJnqR_OkA8jAArwGx20"

TOKEN = "Bearer eyJ4NXQiOiJNV0l5TkRJNVlqRTJaV1kxT0RNd01XSTNOR1ptTVRZeU5UTTJOVFZoWlRnMU5UTTNaVE5oTldKbVpERTFPVEE0TldFMVlUaGxNak5sTldFellqSXlZUSIsImtpZCI6Ik1XSXlOREk1WWpFMlpXWTFPRE13TVdJM05HWm1NVFl5TlRNMk5UVmhaVGcxTlRNM1pUTmhOV0ptWkRFMU9UQTROV0UxWVRobE1qTmxOV0V6WWpJeVlRX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmMTJkMWRiYS1lOWM0LTQ3MzktOGRmNy03Y2IxZjM1MTIxZGEiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6ImtKSkVQNFp1SFA5ZDFhbXlyV1VCWkhaM1VVZ2EiLCJuYmYiOjE3NzA1OTgyMDMsImF6cCI6ImtKSkVQNFp1SFA5ZDFhbXlyV1VCWkhaM1VVZ2EiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczpcL1wvaW5ub3ZhdGlvbi13c28yLnNlYy5zYW1zdW5nLm5ldDo0NDNcL29hdXRoMlwvdG9rZW4iLCJleHAiOjQ5MjYzNTgyMDMsImlhdCI6MTc3MDU5ODIwMywianRpIjoiNmZkMzkwNTMtZjRiNi00Nzc1LWJkZWItNTg1N2QyZjM2MzBhIiwiY2xpZW50X2lkIjoia0pKRVA0WnVIUDlkMWFteXJXVUJaSFozVVVnYSJ9.Y5SmIjCcQVIXw6b7n6ns9ou79im5GfO9yVgapTHYv2axqSxdwAffQWqJqiJj7dh8RVPxyy-7uv0f82ieKIzwGr2AUoaN2_9ZzrPoLFoka3M-P51G28mmaEFe7YXQjdnKGuu8uxfRlEiC0cGbSaYLx_OCubUIQlMu9G4zYXwIMR6Fl8Awe1jofItvRRXn-sYDUlWPlQPQp0pvUi2CiVBnWRndUog8M1Cdx7tTj87au4AgjxUYGZegqOUXcuqz5IrxkLeYDHkmsMDgJ7UG5icgSrwjLOHohZ0Ok7R_-QqBTLGnRqmeoV6e2Loi-7uoK9kHf-6LZRvc4NCsBryNRR9Iwg"

YOUR_EMAIL = "gilmar.silva@samsung.com" # <--- Confirme se é este o e-mail exato cadastrado

MODEL_ID = "01988e76-8cf9-7c4a-882e-4c24776999a4"

# Headers Montados (Conforme Doc: 1.Chat APIs.txt e automacao_stms.py)
HEADERS = {
    "Content-Type": "application/json",
    "x-generative-ai-client": CLIENT_KEY,
    "x-openapi-token": TOKEN if TOKEN.startswith("Bearer") else f"Bearer {TOKEN}",
    "x-generative-ai-user-email": YOUR_EMAIL
}

# ==============================================================================

class ReviewRequest(BaseModel):
    id: int
    context: str | None = ""
    source_text: str
    target_text: str | None = ""
    char_limit: str | None = ""

class ApproveRequest(BaseModel):
    id: int

def get_db_connection():
    try:
        return psycopg2.connect(**DB_CONFIG)
    except Exception as e:
        logger.error(f"Erro de conexão DB: {e}")
        raise HTTPException(status_code=500, detail="Erro ao conectar no banco de dados.")

def init_db():
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS stms_translations (
                id SERIAL PRIMARY KEY,
                excel_row INTEGER,
                context TEXT,
                source_text TEXT,
                target_text TEXT,
                char_limit TEXT,
                reason TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                source_filename TEXT
            );
        """)
        conn.commit()
        cur.close()
    finally:
        conn.close()

init_db()

@app.get("/strings")
def get_strings():
    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM stms_translations ORDER BY excel_row ASC")
        rows = cur.fetchall()
        return rows
    finally:
        conn.close()

@app.post("/review_ai")
def review_ai(item: ReviewRequest):
    # Prompt do Sistema
    system_prompt = (
        "Você é um Revisor Linguístico Sênior (EN -> PT-BR) da Samsung. "
        "Analise a tradução. Se estiver correta, mantenha. Se tiver erro, sugira a correção. "
        "Responda APENAS um JSON válido: {\"suggestion\": \"texto\", \"reasoning\": \"motivo\"}."
    )
    
    # Mensagem do Usuário
    user_msg = (
        f"Contexto: {item.context}. "
        f"Original: {item.source_text}. "
        f"Tradução Atual: {item.target_text}. "
        f"Limite: {item.char_limit}."
    )

    # Payload adaptado para a rota Trial (que costuma usar 'modelIds' e 'contents')
    payload = {
        "modelIds": [MODEL_ID],
        "contents": [user_msg],
        "isStream": False,
        "systemPrompt": system_prompt,
        "llmConfig": {
            "temperature": 0.1,
            "max_new_tokens": 1024
        }
    }

    try:
        # --- DEBUG VISUAL: Verifique se o Client Key aparece aqui ---
        print("\n" + "="*50)
        print(f"🚀 TENTANDO ACESSAR: {API_URL}")
        print(f"📧 E-MAIL: {HEADERS.get('x-generative-ai-user-email')}")
        print(f"🔑 CLIENT KEY (Início): {HEADERS.get('x-generative-ai-client')[:20]}...") 
        print(f"🎫 TOKEN (Início): {HEADERS.get('x-openapi-token')[:20]}...")
        print("="*50 + "\n")

        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=30)
        
        if response.status_code != 200:
            logger.error(f"❌ Erro API ({response.status_code}): {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Erro API: {response.text}")

        ai_resp = response.json()
        raw_answer = ai_resp.get('content', '') 
        
        # Tratamento de resposta
        if not raw_answer:
             raw_answer = json.dumps(ai_resp)

        clean_json = raw_answer.replace("```json", "").replace("```", "").strip()
        
        try:
            parsed = json.loads(clean_json)
            suggestion = parsed.get('suggestion', item.target_text)
            reasoning = parsed.get('reasoning', 'Revisão automática.')
        except:
            suggestion = clean_json
            reasoning = "IA retornou texto puro."

        # Atualiza Banco
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE stms_translations 
            SET target_text = %s, reason = %s, status = 'reviewing'
            WHERE id = %s
        """, (suggestion, reasoning, item.id))
        conn.commit()
        conn.close()
        
        return {"suggestion": suggestion, "reasoning": reasoning}

    except Exception as e:
        logger.error(f"Erro interno: {e}")
        return {"suggestion": item.target_text, "reasoning": f"Erro Local: {str(e)}"}

@app.post("/approve_string")
def approve_string(data: ApproveRequest):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("UPDATE stms_translations SET status = 'approved' WHERE id = %s", (data.id,))
        conn.commit()
        return {"status": "success"}
    finally:
        conn.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)