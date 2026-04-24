import OpenAI  from 'openai'
import { Message } from '../types'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function chat(history: Message[]): Promise<string>
{
	/*const respose = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: history, max_tokens: 500 })	
	const reply = respose.choices[0]?.message?.content
	if (!reply)
		throw new Error('AI provider returned an empty response')
	return (reply)*/
	const last = history[history.length - 1]
  	return `Mock reply to: "${last.content}"`
}