import { Message, Session } from "../types"

const sessions = new Map<string, Session>()

export function createSession(id: string): Session
{
	const session: Session = {
		id,
		messages: [],
		createdAt: new Date()
	}

	sessions.set(id, session)
	return (session)
}

export function getHistory(sessionId: string): Message[]
{
	const session = sessions.get(sessionId)
	if (!session)
		return []
	return (session.messages)
}

export function storeMessage(sessionId: string, message: Message): void
{
	const session = sessions.get(sessionId)
	if (!session)
		throw new Error('failed to store the message')
	session.messages.push(message)
}

export function sessionExists(sessionId: string): boolean
{
	return (sessions.has(sessionId))
}