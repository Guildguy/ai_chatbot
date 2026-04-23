export interface Message
{
	role: 'user' | 'assistant'
	content: string
}

export interface Session
{
	id: string
	messages: Message[]
	createdAt: Date
}

export interface ChatRequestDTO
{
	sessionId?: string
	messages: string
}

export interface ChatResponseDTO
{
	sessionId: string
	reply: string
}