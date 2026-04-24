import OpenAI  from 'openai'
import { Message } from '../types'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey)
	throw new Error('OPENAI_API_KEY is missing')

const client = new OpenAI({ apiKey })
const modelName = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

export async function chat(history: Message[]): Promise<string>
{
	const response = await client.chat.completions.create({
		model: modelName,
		messages: history,
		max_tokens: 500,
	})

	const reply = response.choices[0]?.message?.content
	if (!reply)
		throw new Error('AI provider returned an empty response')
	return reply
}