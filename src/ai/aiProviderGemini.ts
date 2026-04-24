import { GoogleGenerativeAI } from '@google/generative-ai'
import { Message } from '../types'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing')
}

const client = new GoogleGenerativeAI(apiKey)
const modelName = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
const model = client.getGenerativeModel({ model: modelName })

export async function chat(history: Message[]): Promise<string>
{
  const geminiHistory = history.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))

  const lastMessage = history[history.length - 1]

  const geminiChat = model.startChat({ history: geminiHistory })
  const result = await geminiChat.sendMessage(lastMessage.content)

  const reply = result.response.text()

  if (!reply)
    throw new Error('AI provider returned an empty response')

  return (reply)
}