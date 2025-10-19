"use client"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Info } from "lucide-react"

// Schema
const toolConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  version: z.string().min(1, "Version is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  author: z.object({
    name: z.string().min(1, "Author name is required"),
    contact: z.string().email("Valid email is required"),
    github: z.string().url("Valid GitHub URL is required"),
  }),
  license: z.string().min(1, "License is required"),
  last_updated: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid date is required",
  }),
  tool_type: z.enum(["api", "browser-script", "prompt-only", "hybrid"]),
  capabilities: z.array(z.string()).min(1, "At least one capability is required"),
  inputs: z.array(
    z.object({
      name: z.string().min(1, "Input name is required"),
      type: z.string().min(1, "Input type is required"),
      description: z.string().min(1, "Input description is required"),
      example: z.string().min(1, "Input example is required"),
    })
  ),
  outputs: z.array(
    z.object({
      name: z.string().min(1, "Output name is required"),
      type: z.string().min(1, "Output type is required"),
      description: z.string().min(1, "Output description is required"),
      example: z.string().min(1, "Output example is required"),
    })
  ),
  execution: z.object({
    type: z.enum(["script", "api", "prompt"]),
    language: z.enum(["javascript", "python", "bash", "none"]),
    code: z.string().optional(),
    api: z.object({
      endpoint: z.string().optional(),
      method: z.enum(["GET", "POST", "PUT"]).optional(),
      auth_required: z.boolean().optional(),
    }).optional(),
    promptTemplate: z.string().optional(),
  }),
  usage: z.object({
    instructions: z.string().min(1, "Usage instructions are required"),
    frameworks: z.object({
      chatgpt: z.string().optional(),
      langchain: z.string().optional(),
      crewAI: z.string().optional(),
    }),
  }),
})

type ToolConfigForm = z.infer<typeof toolConfigSchema>

export default function UploadToolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ToolConfigForm>({
    resolver: zodResolver(toolConfigSchema),
    defaultValues: {
      name: "",
      description: "",
      version: "1.0.0",
      tags: [""],
      author: { name: "", contact: "", github: "" },
      license: "MIT",
      last_updated: new Date().toISOString().split('T')[0],
      tool_type: "api",
      capabilities: [""],
      inputs: [{ name: "", type: "", description: "", example: "" }],
      outputs: [{ name: "", type: "", description: "", example: "" }],
      execution: {
        type: "api",
        language: "none",
        api: { endpoint: "", method: "GET", auth_required: false },
      },
      usage: {
        instructions: "",
        frameworks: { chatgpt: "", langchain: "", crewAI: "" },
      },
    },
  })

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control: form.control,
    name: "tags",
  })

  const { fields: capabilityFields, append: appendCapability, remove: removeCapability } = useFieldArray({
    control: form.control,
    name: "capabilities",
  })

  const { fields: inputFields, append: appendInput, remove: removeInput } = useFieldArray({
    control: form.control,
    name: "inputs",
  })

  const { fields: outputFields, append: appendOutput, remove: removeOutput } = useFieldArray({
    control: form.control,
    name: "outputs",
  })

  async function onSubmit(values: ToolConfigForm) {
  setIsSubmitting(true)
  
  try {
    // Clean up empty strings from arrays
    const cleanedValues = {
      ...values,
      tags: values.tags.filter(tag => tag.trim() !== ''),
      capabilities: values.capabilities.filter(cap => cap.trim() !== ''),
    }
    
    // Log what we're sending
    console.log('📤 Submitting tool data:')
    console.log('Inputs:', JSON.stringify(cleanedValues.inputs, null, 2))
    console.log('Outputs:', JSON.stringify(cleanedValues.outputs, null, 2))
    
    const res = await fetch('/api/tools', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanedValues),
    })
    
    const result = await res.json()
    
    console.log('📥 Server response:', result)
    
    if (result.success) {
      alert("Tool submitted successfully!")
      form.reset()
    } else {
      console.error('Submission error:', result)
      
      // Show detailed error if available
      if (result.details) {
        const errorMessages = result.details
          .map((d: any) => `${d.field}: ${d.message}`)
          .join('\n')
        alert(`Validation errors:\n${errorMessages}`)
      } else {
        alert("Error: " + result.error)
      }
    }
  } catch (error) {
    console.error('Network/parse error:', error)
    alert("Submission failed: " + (error instanceof Error ? error.message : 'Unknown error'))
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Upload Tool</h1>
        <p className="text-muted-foreground mt-2">Create and configure your tool specification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Form (2/3 width) */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Define your tool's core identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tool Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Awesome Tool" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version</FormLabel>
                          <FormControl>
                            <Input placeholder="1.0.0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your tool..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="tool_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tool Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="api">API</SelectItem>
                              <SelectItem value="browser-script">Browser Script</SelectItem>
                              <SelectItem value="prompt-only">Prompt Only</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="license"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License</FormLabel>
                          <FormControl>
                            <Input placeholder="MIT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_updated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Updated</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Author Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Author Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="author.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="author.contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="author.github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags & Capabilities */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tagFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`tags.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Tag" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {tagFields.length > 1 && (
                          <Button type="button" variant="outline" size="icon" onClick={() => removeTag(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendTag("")} className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add Tag
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {capabilityFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`capabilities.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Capability" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {capabilityFields.length > 1 && (
                          <Button type="button" variant="outline" size="icon" onClick={() => removeCapability(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendCapability("")} className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add Capability
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Input Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle>Input Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inputFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Input #{index + 1}</h4>
                        {inputFields.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeInput(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`inputs.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="parameter_name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`inputs.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <FormControl>
                                <Input placeholder="string" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`inputs.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Parameter description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`inputs.${index}.example`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Example</FormLabel>
                            <FormControl>
                              <Input placeholder="Example value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendInput({ name: "", type: "", description: "", example: "" })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Input
                  </Button>
                </CardContent>
              </Card>

              {/* Output Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle>Output Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {outputFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Output #{index + 1}</h4>
                        {outputFields.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeOutput(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`outputs.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="result_name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`outputs.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <FormControl>
                                <Input placeholder="string" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`outputs.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Output description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`outputs.${index}.example`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Example</FormLabel>
                            <FormControl>
                              <Input placeholder="Example output" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendOutput({ name: "", type: "", description: "", example: "" })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Output
                  </Button>
                </CardContent>
              </Card>

              {/* Execution Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Execution Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="execution.type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Execution Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="script">Script</SelectItem>
                              <SelectItem value="api">API</SelectItem>
                              <SelectItem value="prompt">Prompt</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="execution.language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="bash">Bash</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="execution.code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your code here..." {...field} className="font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="execution.promptTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt Template (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your prompt template..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">API Configuration (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="execution.api.endpoint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endpoint</FormLabel>
                            <FormControl>
                              <Input placeholder="https://api.example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="execution.api.method"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="execution.api.auth_required"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Authentication Required</FormLabel>
                            <FormDescription>Does this API require authentication?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Usage Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="usage.instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How to use this tool..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Framework Integration (Optional)</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="usage.frameworks.chatgpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ChatGPT</FormLabel>
                            <FormControl>
                              <Textarea placeholder="ChatGPT integration..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usage.frameworks.langchain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LangChain</FormLabel>
                            <FormControl>
                              <Textarea placeholder="LangChain integration..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usage.frameworks.crewAI"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CrewAI</FormLabel>
                            <FormControl>
                              <Textarea placeholder="CrewAI integration..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Tool"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Right side - Instructions (1/3 width, sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <p className="text-muted-foreground">
                    Fill out this form to create a comprehensive tool specification. All fields marked with an asterisk are required.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Choose a clear, descriptive name</li>
                    <li>Use semantic versioning (e.g., 1.0.0)</li>
                    <li>Write a concise description</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Tool Types</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>API:</strong> External API integration</li>
                    <li><strong>Browser Script:</strong> Client-side JavaScript</li>
                    <li><strong>Prompt Only:</strong> AI prompt template</li>
                    <li><strong>Hybrid:</strong> Combination of types</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Parameters</h3>
                  <p className="text-muted-foreground mb-2">
                    Define inputs and outputs clearly:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Use descriptive names</li>
                    <li>Specify data types accurately</li>
                    <li>Provide realistic examples</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Execution</h3>
                  <p className="text-muted-foreground">
                    Configure how your tool runs. Choose the appropriate execution type and language, then provide implementation details.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Tips</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Be specific in descriptions</li>
                    <li>Test your tool before submitting</li>
                    <li>Include usage examples</li>
                    <li>Keep documentation updated</li>
                  </ul>
                </div>

                <Separator />

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Need help? Contact support at support@example.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}