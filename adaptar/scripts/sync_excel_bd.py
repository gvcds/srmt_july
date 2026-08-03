import win32com.client
import psycopg2
import os
import glob
import time

# --- DIRETÓRIOS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
ROOT_DIR = os.path.dirname(BASE_DIR)

INPUT_DIR = os.path.join(ROOT_DIR, 'input')

# --- BANCO DE DADOS ---
DB_CONFIG = {
    "dbname": "srmt",
    "user": "postgres",
    "password": "326741@Vv", 
    "host": "localhost",
    "port": "5432"
}

def connect_db():
    return psycopg2.connect(**DB_CONFIG)

def ensure_dirs():
    if not os.path.exists(INPUT_DIR):
        os.makedirs(INPUT_DIR, exist_ok=True)

def importar_input():
    # Busca recursiva em subpastas de INPUT_DIR
    arquivos = glob.glob(os.path.join(INPUT_DIR, "**", "*.xlsx"), recursive=True)
    
    if not arquivos:
        return

    print(f"\n--- ENCONTRADOS {len(arquivos)} ARQUIVOS EM INPUT ---")
    print("Iniciando Importação...")
    
    excel = win32com.client.Dispatch("Excel.Application")
    excel.Visible = False
    excel.DisplayAlerts = False
    
    conn = connect_db()
    cursor = conn.cursor()

    # Garante que a tabela tenha as colunas design_type e design_id
    try:
        cursor.execute("ALTER TABLE stms_translations ADD COLUMN IF NOT EXISTS design_type TEXT;")
        cursor.execute("ALTER TABLE stms_translations ADD COLUMN IF NOT EXISTS design_id TEXT;")
        conn.commit()
    except Exception as e:
        print(f"Erro ao verificar/criar colunas adicionais: {e}")
        conn.rollback()

    for arquivo in arquivos:
        nome = os.path.basename(arquivo)
        print(f"Lendo: {nome}")
        wb = None
        
        try:
            wb = excel.Workbooks.Open(arquivo)
            ws = wb.ActiveSheet
            linha = 2
            count = 0
            
            # Loop até encontrar célula vazia na coluna 5 (Source Text)
            while ws.Cells(linha, 5).Value:
                did = str(ws.Cells(linha, 2).Value or "")
                ctx = str(ws.Cells(linha, 4).Value or "")
                src = str(ws.Cells(linha, 5).Value or "")
                tgt = str(ws.Cells(linha, 6).Value or "")
                lim = str(ws.Cells(linha, 7).Value or "")
                dt = str(ws.Cells(linha, 13).Value or "")
                
                # Insere no BD
                cursor.execute("""
                    INSERT INTO stms_translations 
                    (excel_row, design_id, context, source_text, target_text, char_limit, status, source_filename, design_type)
                    VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s, %s)
                """, (linha, did, ctx, src, tgt, lim, nome, dt))
                
                linha += 1
                count += 1
            
            conn.commit() # Salva o progresso deste arquivo
            
            # Fecha o arquivo antes de deletar
            if wb:
                wb.Close(SaveChanges=False)
            wb = None
            
            # Pequena pausa para garantir que o Excel liberou o arquivo no Windows
            time.sleep(0.5)
            
            # Deleta a planilha após importar com sucesso
            if os.path.exists(arquivo):
                os.remove(arquivo)
                print(f"  -> {count} linhas importadas. Planilha deletada com sucesso.")
            
        except Exception as e:
            print(f"  -> ERRO no arquivo {nome}: {e}")
            if wb: 
                try: wb.Close(SaveChanges=False)
                except: pass
            conn.rollback()

    conn.close()
    excel.Quit()
    print("--- IMPORTAÇÃO FINALIZADA ---")

def monitoramento_automatico():
    print("\n" + "="*40)
    print(" MODO MONITORAMENTO AUTOMÁTICO ATIVO")
    print(" De olho na pasta 'input'...")
    print(" Pressione Ctrl+C para parar.")
    print("="*40 + "\n")
    
    try:
        while True:
            importar_input()
            time.sleep(5) # Verifica a cada 5 segundos
    except KeyboardInterrupt:
        print("\nMonitoramento parado pelo usuário.")

if __name__ == "__main__":
    ensure_dirs()
    print("1. Importar Manual (Input -> BD -> Deletar)")
    print("2. MONITORAMENTO AUTOMÁTICO (Sempre ativo)")
    opt = input("Opção: ")
    
    if opt == "1": importar_input()
    elif opt == "2": monitoramento_automatico()