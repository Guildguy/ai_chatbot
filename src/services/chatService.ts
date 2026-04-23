import * as sessionManager from '../sessions/sessionManager'
import * as aiProvider from '../ai/aiProvider'
import { ChatRequestDTO, ChatResponseDTO } from '../types'
import { randomUUID } from 'crypto'

export async function handleMessage(dto: ChatRequestDTO): Promise<ChatResponseDTO>
{
	const id = dto.sessionId ?? randomUUID()
	if (!sessionManager.sessionExists(id))
		sessionManager.createSession(id)
	sessionManager.storeMessage(id, { role: 'user', content: dto.messages })

	const history = sessionManager.getHistory(id)
	const reply = await aiProvider.chat(history)
	sessionManager.storeMessage(id, { role: 'assistant', content: reply })
	return ({ sessionId: id, reply, })
}