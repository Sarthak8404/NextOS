// app/api/tools/search/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Tool from '@/models/tools'
import { generateEmbedding } from '@/lib/embeddings'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { query, limit = 10 } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(query)

    // Perform vector search using MongoDB Atlas Vector Search
    const tools = await Tool.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index', // Name of your Atlas Search index
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: limit,
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          version: 1,
          tags: 1,
          author: 1,
          license: 1,
          last_updated: 1,
          tool_type: 1,
          capabilities: 1,
          inputs: 1,
          outputs: 1,
          execution: 1,
          usage: 1,
          createdAt: 1,
          updatedAt: 1,
          score: { $meta: 'vectorSearchScore' }, // Similarity score
        },
      },
    ])

    return NextResponse.json({
      success: true,
      data: tools,
      count: tools.length,
    })
  } catch (error: any) {
    console.error('Error searching tools:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search tools',
      },
      { status: 500 }
    )
  }
}