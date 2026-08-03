import win32com.client
import requests
import time

# --- CONFIGURAÇÕES ---
# O servidor backend/server.py deve estar rodando em http://localhost:8001
API_URL = "http://localhost:8001/stms/review_text"

def consultar_ia(contexto, texto_ingles, traducao_atual, limite_espaco):
    payload = {
        "id": 0, # Ignorado pelo server neste endpoint genérico
        "context": contexto or "",
        "source_text": texto_ingles or "",
        "target_text": traducao_atual or "",
        "char_limit": str(limite_espaco) if limite_espaco else ""
    }

    try:
        response = requests.post(API_URL, json=payload, timeout=60)
        if response.status_code == 200:
            data = response.json()
            # Retorna apenas a sugestão da IA (Ollama)
            return data.get('suggestion')
        print(f"Erro no servidor local ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"Erro ao conectar com servidor local: {e}")
    return None

def main():
    print("Iniciando Automação Excel STMS (Ollama AI via Local Server)...")
    try:
        excel = win32com.client.Dispatch("Excel.Application")
        wb = excel.ActiveWorkbook
        if not wb: 
            print("Nenhum arquivo Excel aberto encontrado.")
            return
        
        ws = wb.ActiveSheet
        linha = 2
        
        while ws.Cells(linha, 5).Value:
            # Coluna 5: Source Text
            # Coluna 8: Status/Obs (Evita processar o que já foi processado)
            if ws.Cells(linha, 8).Value == "Improve Text Quality":
                linha += 1
                continue

            print(f"Processando linha {linha}...")
            
            # Mapeamento de Colunas (STMS Padrão):
            # 4: Context
            # 5: Source (EN)
            # 6: Target (PT)
            # 7: Max Length
            
            res = consultar_ia(
                ws.Cells(linha, 4).Value, 
                ws.Cells(linha, 5).Value, 
                ws.Cells(linha, 6).Value, 
                ws.Cells(linha, 7).Value
            )
            
            if res:
                ws.Cells(linha, 6).Value = res
                ws.Cells(linha, 8).Value = "Improve Text Quality"
                # Verde claro para indicar alteração pela IA
                ws.Cells(linha, 6).Interior.Color = 0xCCFFCC 
            
            linha += 1
            # Pequeno delay para não sobrecarregar
            time.sleep(0.1)
            
        print("Concluído! Todas as linhas processadas.")
    except Exception as e:
        print(f"Erro fatal: {e}")

if __name__ == "__main__":
    main()
