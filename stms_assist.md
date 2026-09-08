# Documentacao Tecnica: STMS AI Assist

Esta documentacao descreve exclusivamente a ferramenta **STMS AI Assist** (assistente inteligente para suporte nas traducoes via banco de dados) e o funcionamento da integracao com a Inteligencia Artificial (LLM) no backend.

---

## 1. Visao Geral da Arquitetura

O STMS AI Assist atua como uma interface de analise em lote para traducoes armazenadas no banco de dados. O frontend fornece a listagem, os filtros e o motor de requisicao paralela, enquanto o backend aplica regras de negocio corporativas e orquestra a chamada externa de IA.

```mermaid
sequenceDiagram
    participant Front as Frontend (STMS AI Assist)
    participant Back as Backend (FastAPI)
    participant DB as Banco & Contexto
    participant IA as Proxy Sidia (vLLM)

    Front->>Back: Solicita Revisao em Lote
    Back->>DB: Consulta Termos e Glossario
    DB-->>Back: Retorna Regras
    Back->>IA: Envia Prompt Formatado
    IA-->>Back: Devolve Tags XML
    Back->>Back: Extrai Sugestao via Regex
    Back-->>Front: Entrega Dados para Tabela
```

---

## 2. Tecnologias de Desenvolvimento

As tecnologias abaixo englobam exclusivamente o escopo do STMS AI Assist no sistema:

### Frontend
- **React.js com Next.js:** Roteamento e arquitetura de componentes para a tela da ferramenta de banco de dados (`STMSDBTool`).
- **TypeScript:** Tipagem forte das interfaces, como status das strings (`pending`, `reviewing`, `approved`) e respostas da API (`AIReviewResponse`).
- **Tailwind CSS:** Construcao fluida e responsiva da tabela de revisao, paginacao e cores de status dinamicas (Modo Escuro / Claro).
- **Lucide React:** Biblioteca responsavel pela iconografia da ferramenta (botoes de Approve, Reject, Lotes).

### Backend
- **FastAPI:** Framework Python assincrono que expoem as rotas `/stms/strings` e as rotas de IA usadas pela ferramenta.
- **PostgreSQL (SQLAlchemy e psycopg2):** Orquestra o pool de conexoes para resgatar as strings originais e auditar os metadados do glossario oficial da Samsung.
- **Requests:** Faz as interacoes RESTful contra o Proxy da IA corporativa.
- **Concurrent.futures (ThreadPoolExecutor):** Ferramenta do Python usada para paralelizar requisicoes massivas, avaliando 15 ou mais strings simultaneamente de modo nao bloqueante.
- **Regular Expressions (re):** Engine nativa usada para limpar as alucinacoes textuais do LLM e recuperar somente os padroes de tag XML requeridos.

### Infraestrutura IA
- **Sidia OpenWebUI:** Proxy de interface de seguranca corporativa que padroniza os pacotes e protege as chaves.
- **vLLM:** O motor que hospeda fisicamente e executa a inferencia do modelo.

---

## 3. Interface e Fluxo no Frontend

O componente responsavel por esta funcionalidade acessa a base de dados do sistema, exibe os itens traduziveis em tabela e permite que a Inteligencia Artificial faca a revisao tecnica.

### Fluxo de Processamento

1. O usuario acessa a tabela de strings e filtra os registros (ex: apenas itens "Pending").
2. Ao iniciar o processo em lote, o frontend agrupa os itens (blocos de 15) e dispara para a API de revisao.
3. Apos a resposta da API, o frontend injeta a "Sugestao" e o "Motivo" diretamente na linha da tabela.
4. O usuario aprova (Approve) ou rejeita (Reject) a sugestao da IA.

```mermaid
graph LR
    A[Carregar Strings] --> B[Agrupar Itens Pendentes]
    B --> C[Envio para API]
    C --> D[Retorno Parseado]
    D --> E[Aprovacao Humana]
```

---

## 4. Partes do Codigo de IA (LLM)

A execucao da IA no arquivo `server.py` segue um protocolo de restricoes severas para garantir previsibilidade e precisao tecnica para traducoes complexas.

### 4.1 Configuracao e Proxy Corporativo

O sistema se conecta a um proxy interno e por isso ignora a certificacao SSL nativa (`verify=False`).

```python
PROXY_URL = "https://openwebui.sidia.org.br/api/chat/completions"
API_KEY   = 'API_KEY'
MODEL_ID  = "openai/gpt-oss-120b"
```

### 4.2 Leitura da Base de Conhecimento

Antes de montar o prompt, o sistema precisa ler os guias de estilo e o historico de erros do usuario armazenados em arquivos de texto locais (pasta `knowledge_base/`).

**Leitura do Guia de Estilo (Tone of Voice):**
O backend le o arquivo `tone_of_voice.txt` e fragmenta o documento em secoes usando os marcadores `#`. Apenas as secoes relevantes serao injetadas no prompt.

```python
kb_path = os.path.join(os.path.dirname(__file__), 'knowledge_base', 'tone_of_voice.txt')
with open(kb_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Logica interna fragmenta o content baseado nas hashtags '#' para extracao cirurgica
```

**Leitura de Feedbacks Anteriores:**
Para evitar que a IA repita correcoes invalidas que o analista ja rejeitou, o sistema anexa os ultimos 50 erros reportados diretamente do arquivo de feedback.

```python
# Injetar feedback de erros anteriores reportados pelo usuario
try:
    feedback_filename = f"feedback_{target_lang}.txt"
    feedback_path = os.path.join(os.path.dirname(__file__), 'knowledge_base', feedback_filename)
    if os.path.exists(feedback_path):
        with open(feedback_path, 'r', encoding='utf-8') as f:
            feedback_content = f.read().strip()
        if feedback_content:
            # Limitar para os ultimos 50 feedbacks para nao sobrecarregar o prompt (context window)
            feedback_entries = feedback_content.split("--- FEEDBACK")
            recent_entries = feedback_entries[-50:] if len(feedback_entries) > 50 else feedback_entries
            trimmed_feedback = "--- FEEDBACK".join(recent_entries).strip()
            
            # Concatena os feedbacks nas regras relevantes do LLM
            relevant_rules += f"\n\n[ERROS ANTERIORES REPORTADOS PELO USUARIO — NAO REPITA ESTES ERROS:]\n{trimmed_feedback}\n"
except Exception as e:
    print(f"Aviso: Nao foi possivel carregar feedback: {e}")
```

### 4.3 Construcao do System Prompt

Apos filtrar as regras do `tone_of_voice.txt` e anexar os feedbacks, o backend constroi o contexto. A IA e proibida de responder fora das tags.

```python
# O System Prompt exige que a IA se comporte como Revisor Samsung e devolva APENAS tags XML
system_prompt = f"""Voce e o Revisor de Traducao da SAMSUNG.
DIRETRIZES APLICAVEIS PARA ESTA STRING:
{relevant_rules}

INSTRUCOES (LEIA COM ATENCAO):
- O idioma alvo da revisao e obrigatoriamente {lang_name}.
- Analise SEVERAMENTE o texto atual.
- Se a Regra de Ouro do Glossario estiver presente, ELA E SOBERANA.
- Responda EXATAMENTE neste formato XML: 
<advice>sugestao corrigida ou 'Mantido' se estiver perfeito</advice>
<reason>motivo detalhado da alteracao</reason>
<simplyReason>resumo curto do erro. Retorne 'Correto' SOMENTE SE advice for 'Mantido'</simplyReason>
"""

# O texto do usuario recebe a string original e a atual que a IA deve auditar
user_content = f"Chave: {key} | Contexto: {design_type}\nEN: {en_content}\nPT: {pt_content}\n{glossary_hint}"

messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": user_content}
]
```

### 4.4 Determinismo e Envio (Payload)

A chave para impedir que a Inteligencia Artificial alucine ou faca resumos criativos e baixar o parametro `temperature` a um nivel estrito.

```python
payload = {
    "model": model or MODEL_ID,
    "messages": messages,
    "temperature": 0.1,  # Impede variacoes criativas
    "stream": False
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
```

### 4.5 Mecanismo de Retry da IA

Como a API externa pode enfrentar instabilidade durante avaliacoes massivas em lote, o backend conta com um laco de repeticao com "backoff" (espera progressiva).

```python
max_retries = 3
for attempt in range(max_retries):
    try:
        response = requests.post(PROXY_URL, headers=headers, json=payload, verify=False, timeout=200)
        
        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            break # Sai do loop em caso de sucesso
            
        time.sleep(2 * (attempt + 1))  # Espera progressiva: 2s, 4s...
    except Exception as e:
        time.sleep(2 * (attempt + 1))
```

### 4.6 Extracao XML e Trava de Seguranca

Para garantir que a resposta nao seja apenas texto livre, a saida bruta da IA e dissecada usando Expressoes Regulares (Regex). Alem disso, ha uma trava logica importante: se a IA sugeriu modificacoes no texto, ela e proibida de qualificar o texto original como "Correto" perante as regras gramaticais.

```python
# Disseca os nós da resposta da IA
match = re.search(
    r'<advice>(.*?)</advice>.*?<reason>(.*?)</reason>.*?<simplyReason>(.*?)</simplyReason>',
    content, re.DOTALL
)

if match:
    advice = match.group(1).strip()
    reason = match.group(2).strip()
    simply = match.group(3).strip()

    # Trava de alucinacao: Corrige a metrica caso a IA diga que estava certo mas efetuou trocas
    if advice != "Mantido" and advice != pt_content:
        if simply.lower() in ["correto", "preciso", "ok", "perfeito"]:
            simply = "Alteracao de formatacao/pontuacao"
```
