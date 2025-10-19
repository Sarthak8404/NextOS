// app/api/tools/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Tool from '@/models/tools' // Make sure this path matches your file
import { generateEmbedding, createSearchableText } from '@/lib/embeddings'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()
    
    console.log('📝 Creating tool:', data.name)
    console.log('Inputs received:', JSON.stringify(data.inputs, null, 2))
    console.log('Outputs received:', JSON.stringify(data.outputs, null, 2))

    // Validate that inputs and outputs are arrays
    if (!Array.isArray(data.inputs)) {
      throw new Error('Inputs must be an array')
    }
    if (!Array.isArray(data.outputs)) {
      throw new Error('Outputs must be an array')
    }

    // Generate embeddings (make sure this doesn't mutate the data)
    const searchableText = createSearchableText(data)
    const embedding = await generateEmbedding(searchableText)
    console.log(`🔢 Embedding generated: ${embedding.length} dimensions`)

    // Create the tool document
    const toolData = {
      name: data.name,
      description: data.description,
      version: data.version,
      tags: data.tags || [],
      author: data.author,
      license: data.license,
      last_updated: data.last_updated,
      tool_type: data.tool_type,
      capabilities: data.capabilities || [],
      inputs: data.inputs,
      outputs: data.outputs,
      execution: data.execution,
      usage: data.usage,
      embedding: Array.from(embedding),
    }

    console.log('Creating tool with data:', JSON.stringify(toolData, null, 2))

    const tool = new Tool(toolData)
    const savedTool = await tool.save()
    
    console.log('✅ Tool saved successfully:', savedTool._id)

    return NextResponse.json({
      success: true,
      data: savedTool,
      message: 'Tool created successfully',
    })
  } catch (error) {
    console.error('❌ Error creating tool:', error)
    
    // Detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as any
      console.error('Validation errors:', validationError.errors)
      
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: Object.keys(validationError.errors).map(key => ({
          field: key,
          message: validationError.errors[key].message
        }))
      }, { status: 400 })
    }

    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      success: false, 
      error: message || 'Failed to create tool' 
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const checkEmbeddings = searchParams.get('checkEmbeddings') === 'true'

    const tools = await Tool.find({}).sort({ createdAt: -1 }).lean()

    if (checkEmbeddings) {
      console.log('\n📊 Embedding Status:')
      tools.forEach((t, i) =>
        console.log(
          `${i + 1}. ${t.name}: ${
            t.embedding?.length ? `✅ ${t.embedding.length} dims` : '❌ None'
          }`
        )
      )
    }

    return NextResponse.json({
      success: true,
      data: tools,
      count: tools.length,
    })
  } catch (error) {
    console.error('❌ Error fetching tools:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      success: false, 
      error: message || 'Failed to fetch tools' 
    }, { status: 500 })
  }
}