// lib/embeddings.ts
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [
            {
              text: text,
            },
          ],
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await response.json()
  return data.embedding.values
}

// Helper function to create searchable text from tool data
export function createSearchableText(tool: any): string {
  const parts = [
    tool.name,
    tool.description,
    tool.tags?.join(' '),
    tool.capabilities?.join(' '),
    tool.tool_type,
    tool.usage?.instructions,
  ].filter(Boolean)
  
  return parts.join(' ')
}