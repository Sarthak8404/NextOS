// models/tools.ts
import mongoose from 'mongoose'

// Define a sub-schema for input/output parameters
const parameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  example: { type: String, required: true },
}, { _id: false })

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  tags: [{ type: String }],
  author: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    github: { type: String, required: true },
  },
  license: { type: String, required: true },
  last_updated: { type: Date, required: true },
  tool_type: { 
    type: String, 
    enum: ['api', 'browser-script', 'prompt-only', 'hybrid'],
    required: true 
  },
  capabilities: [{ type: String }],
  
  // ✅ Array of objects, not strings!
  inputs: [parameterSchema],
  outputs: [parameterSchema],
  
  execution: {
    type: { 
      type: String, 
      enum: ['script', 'api', 'prompt'],
      required: true 
    },
    language: { 
      type: String, 
      enum: ['javascript', 'python', 'bash', 'none'],
      required: true 
    },
    code: { type: String, required: false },
    api: {
      endpoint: { type: String, required: false },
      method: { 
        type: String, 
        enum: ['GET', 'POST', 'PUT'],
        required: false 
      },
      auth_required: { type: Boolean, required: false, default: false },
    },
    promptTemplate: { type: String, required: false },
  },
  usage: {
    instructions: { type: String, required: true },
    frameworks: {
      chatgpt: { type: String, required: false },
      langchain: { type: String, required: false },
      crewAI: { type: String, required: false },
    },
  },
  
  embedding: { 
    type: [Number],
    required: false,
    default: []
  },
}, {
  timestamps: true,
  strict: true,
})

toolSchema.index({ name: 1 })
toolSchema.index({ tool_type: 1 })
toolSchema.index({ createdAt: -1 })

export default mongoose.models.Tool || mongoose.model('Tool', toolSchema)