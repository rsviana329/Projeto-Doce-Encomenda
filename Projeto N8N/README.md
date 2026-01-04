# 📘 Guia de Importação e Configuração do Workflow no n8n

Este guia explica, **passo a passo**, como importar o workflow no **n8n**, configurar a **credencial da Groq (LLM)** e executar o fluxo corretamente.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de que você possui:

- Acesso ao **n8n** (Cloud ou Self-hosted)
- O Doceencomenda.json
- Uma **chave de API da Groq**
  - Pode ser obtida em: https://console.groq.com
- Acesso ao **Telegram** (caso vá testar o envio de mensagens)

---

## 1️⃣ Importando o Workflow no n8n

1. Acesse o painel do **n8n**
2. No menu lateral, clique em **Personal**
3. Clique no botão **“+” (Create Workflow)** ou vá até **Workflows**
4. No canto superior direito, clique nos **três pontos (⋮)**
5. Selecione **Import from File**
6. Escolha o arquivo Doceencomenda.json
7. O workflow será carregado automaticamente no editor

📌 Após a importação, você verá os nós conectados conforme o diagrama do fluxo.

---

## 2️⃣ Criando a Credencial da Groq (Chat Model)

Este workflow utiliza um **Groq Chat Model** como LLM.

### Passo a passo para criar a credencial:

1. No menu lateral do n8n, clique em **Credentials**
2. Clique em **Add Credential**
3. Procure por **Groq**
4. Selecione **Groq API**
5. Preencha os campos:
   - **API Key**: cole sua chave da Groq
6. Clique em **Save**

✅ A credencial agora estará disponível para uso no workflow.

---

## 3️⃣ Vinculando a Credencial ao Nó “Groq Chat Model”

1. Volte ao workflow importado
2. Clique no nó **Groq Chat Model**
3. No campo **Credential**, selecione a credencial da Groq criada anteriormente
4. Verifique se:
   - O **modelo** está selecionado corretamente
   - O nó aparece com o ✔️ verde (sem erros)

---

## 4️⃣ Conferindo os Principais Nós do Workflow

### 🔹 Webhook
- Responsável por receber os dados de entrada
- Copie a **URL do Webhook** caso precise integrar com outro sistema

### 🔹 Nó “dados”
- Trata ou organiza as informações recebidas
- Não requer credenciais

### 🔹 AI Agent + Basic LLM Chain
- Responsáveis pelo processamento com IA
- Devem estar conectados corretamente ao **Groq Chat Model**

### 🔹 Telegram (Send a text message / Send a photo message)
- Necessita credencial do **Telegram Bot**
- Caso não utilize Telegram, estes nós podem ser desativados

---

## 5️⃣ (Opcional) Configurando Credencial do Telegram

Caso vá utilizar o envio de mensagens:

1. Vá em **Credentials**
2. Clique em **Add Credential**
3. Selecione **Telegram Bot API**
4. Insira o **Bot Token**
5. Salve e vincule aos nós:
   - `Send a text message`
   - `Send a photo message`

---

## 6️⃣ Salvando e Publicando o Workflow

1. Clique em **Save**
2. Clique em **Publish**
3. O workflow estará pronto para execução

---

## 7️⃣ Executando o Workflow

- Para testes:
  - Clique em **Execute workflow**
- Para uso real:
  - Utilize a **URL do Webhook** gerada pelo nó inicial

Se todos os nós estiverem com ✔️ verde, o fluxo está funcionando corretamente.

---

## 🧪 Dicas Importantes

- Caso algum nó fique em vermelho:
  - Verifique se a **credencial da Groq** está corretamente vinculada
- Se o workflow não responder:
  - Confira se o **Webhook está ativo**
- Para ambientes educacionais:
  - Recomenda-se executar em modo de teste antes da publicação

---

## 📌 Suporte

Em caso de dúvidas:
- Verifique os logs na aba **Executions**
- Confirme se a chave da Groq está válida e ativa
