import { Request, Response, NextFunction } from 'express'
import * as ChatService from '../services/chatService'
import { ChatRequestDTO } from '../types'

export async function handleChat(request: Request, response: Response, next: NextFunction): Promise<void>
{
	try
	{
		const dto: ChatRequestDTO = { sessionId: request.body.sessionId, messages: request.body.message, }

		if (!dto.messages || typeof dto.messages !== 'string')
		{
			response.status(400).json({ error: 'Message is required' })
			return 
		}
		const result = await ChatService.handleMessage(dto)
		response.status(200).json(result)
	}
	catch(err)
	{
		next(err)
	}
}