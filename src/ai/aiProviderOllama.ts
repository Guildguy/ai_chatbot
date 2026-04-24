import { Message } from '../types'

const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434'
const modelName = process.env.OLLAMA_MODEL ?? 'llama3.2'

export async function chat(history: Message[]): Promise<string>
{
	let response: Response
	try
	{
		response = await fetch(`${baseUrl}/api/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: modelName,
				stream: false,
				messages: history,
			}),
		})
	}
	catch (err)
	{
		const message = err instanceof Error ? err.message : String(err)
		throw new Error(`Could not reach Ollama at ${baseUrl}. Start it with Docker (\`make ollama-up\`) and download model (\`make ollama-pull OLLAMA_MODEL=${modelName}\`). Original error: ${message}`)
	}

	if (!response.ok)
	{
		const raw = await response.text()
		throw new Error(`Ollama request failed (${response.status}): ${raw}`)
	}

	const data = await response.json() as {
		message?: { content?: string }
	}

	const reply = data.message?.content
	if (!reply)
		throw new Error('Ollama provider returned an empty response')

	return (reply)
}
