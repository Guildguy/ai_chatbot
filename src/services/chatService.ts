import * as sessionManager from '../sessions/sessionManager'
import * as geminiProvider from '../ai/aiProviderGemini'
import * as openAIProvider from '../ai/aiProviderGPT'
import * as ollamaProvider from '../ai/aiProviderOllama'
import { ChatRequestDTO, ChatResponseDTO } from '../types'
import { randomUUID } from 'crypto'

function isQuotaError(err: unknown): boolean
{
	const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase()
	return message.includes('429') || message.includes('quota exceeded') || message.includes('too many requests')
}

type ProviderName = 'gemini' | 'openai' | 'ollama' | 'auto'

async function callProvider(name: Exclude<ProviderName, 'auto'>, history: Parameters<typeof geminiProvider.chat>[0]): Promise<string>
{
	if (name === 'gemini')
		return (geminiProvider.chat(history))
	if (name === 'openai')
		return (openAIProvider.chat(history))
	return (ollamaProvider.chat(history))
}

export async function handleMessage(dto: ChatRequestDTO): Promise<ChatResponseDTO>
{
	const id = dto.sessionId ?? randomUUID()
	if (!sessionManager.sessionExists(id))
		sessionManager.createSession(id)
	sessionManager.storeMessage(id, { role: 'user', content: dto.messages })

	const history = sessionManager.getHistory(id)
	const provider = (process.env.AI_PROVIDER?.toLowerCase() as ProviderName | undefined) ?? 'auto'
	let reply: string

	if (provider !== 'auto')
		reply = await callProvider(provider, history)
	else
	{
		try
		{
			reply = await geminiProvider.chat(history)
		}
		catch (geminiErr)
		{
			if (!isQuotaError(geminiErr))
				throw geminiErr

			try
			{
				reply = await openAIProvider.chat(history)
			}
			catch (openAIErr)
			{
				if (!isQuotaError(openAIErr))
					throw openAIErr

				reply = await ollamaProvider.chat(history)
			}
		}
	}

	sessionManager.storeMessage(id, { role: 'assistant', content: reply })
	return ({ sessionId: id, reply, })
}