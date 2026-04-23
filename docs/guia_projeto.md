# Guia do Projeto `chat_bot_int`

## O que este projeto faz

Este projeto implementa uma API HTTP simples de chat com IA.

- Recebe uma mensagem do usuario via endpoint HTTP.
- Recupera o historico da sessao (em memoria).
- Envia o historico para um provider de IA (OpenAI).
- Retorna a resposta da IA e salva a conversa na sessao.

## Arquitetura (camadas)

- `src/routes/chatRoutes.ts`: define a rota `POST /api/chat`.
- `src/controllers/chatController.ts`: valida entrada HTTP e chama o service.
- `src/services/chatService.ts`: orquestra sessao + provider de IA.
- `src/sessions/sessionManager.ts`: armazena historico em `Map` na memoria.
- `src/ai/aiProvider.ts`: integra com a API da OpenAI.
- `src/types/index.ts`: contratos de tipos (`DTOs`, `Message`, `Session`).

## Fluxo da requisicao

1. Cliente envia `POST /api/chat` com mensagem e, opcionalmente, `sessionId`.
2. Controller valida o payload.
3. Service cria ou reaproveita sessao.
4. Mensagem do usuario e adicionada ao historico.
5. Provider chama a OpenAI com o historico.
6. Resposta da IA e salva no historico.
7. API retorna `sessionId` + `reply`.

## Contratos de dados

Tipos definidos em `src/types/index.ts`:

- `Message`: `{ role: 'user' | 'assistant', content: string }`
- `Session`: `{ id, messages, createdAt }`
- `ChatRequestDTO`: `{ sessionId?: string, messages: string }`
- `ChatResponseDTO`: `{ sessionId: string, reply: string }`

## Endpoint principal

- Metodo: `POST`
- URL: `/api/chat`
- Body esperado (conceitual):

```json
{
  "sessionId": "opcional",
  "message": "Oi, tudo bem?"
}
```

Resposta esperada:

```json
{
  "sessionId": "uuid-da-sessao",
  "reply": "Resposta da IA"
}
```

## Como usar (passo a passo)

Observacao: no estado atual, o projeto ainda nao tem scripts no `package.json` nem todas as dependencias de runtime/dev configuradas.

1. Entre na pasta `src`:

```bash
cd src
```

2. Instale dependencias minimas:

```bash
npm install openai express
npm install -D typescript tsx @types/node @types/express
```

3. Defina a chave da OpenAI:

```bash
export OPENAI_API_KEY="sua_chave_aqui"
```

4. Execute em modo desenvolvimento:

```bash
npx tsx index.ts
```

5. Teste com `curl`:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Explique em 1 linha o que e Node.js"}'
```

## Estado atual e pontos de atencao

Durante a analise, estes pontos foram identificados no codigo:

- `src/package.json` contem apenas `openai` (faltam `express` e scripts).

## Limites atuais

- Sessoes sao apenas em memoria (`Map`), entao dados se perdem ao reiniciar o processo.
- Nao ha persistencia em banco.
- Nao ha middleware global de tratamento de erro configurado no `index.ts`.

## Resumo rapido

Projeto pequeno e didatico, com boa separacao por camadas (rota, controller, service, provider e sessao), ideal para evoluir para:

- persistencia real de sessoes,
- observabilidade/logs,
- tratamento robusto de erros,
- scripts de build/start e testes automatizados.