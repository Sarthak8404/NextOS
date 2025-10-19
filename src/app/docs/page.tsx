import React from "react";
import { Copy, Rocket, Database, Layers, Zap, BookOpen, GitBranch } from "lucide-react";

// shadcn/ui components (assume available in the project)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Small helper component for code blocks
function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-md border bg-muted p-4">
      <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{children}</pre>
      <div className="absolute top-3 right-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="ghost" className="p-1">
              <Copy size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <main className="container mx-auto py-12 px-6">
      <header className="mb-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold">Developer Docs — NextOS</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              A platform that lets developers publish tools so AI assistants and LLMs can discover,
              call, and orchestrate them to complete real tasks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* <Badge className="px-3 py-1">AI-ready</Badge> */}
            <Button asChild>
              <a href="/upload" className="flex items-center gap-2">
                <Rocket size={14} /> Publish Tool
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - overview and how it works */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers size={18} /> How it works
              </CardTitle>
              <CardDescription>From upload to execution — the lifecycle of an AI-usable tool.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  <strong>Upload:</strong> Developers publish a tool with metadata (name, description, inputs,
                  outputs, execution details, tags).
                </li>
                <li>
                  <strong>Index:</strong> We generate a compact semantic embedding from the tool metadata and
                  store it for fast semantic search.
                </li>
                <li>
                  <strong>Discover:</strong> When a user or assistant asks something, the platform performs a semantic
                  search and returns the most relevant tool(s).
                </li>
                <li>
                  <strong>Execute:</strong> The assistant calls the selected tool via API or execution adapter, passing
                  structured inputs and receiving structured outputs.
                </li>
              </ol>

              <Separator />

              <h4 className="text-sm font-medium">Why semantic search?</h4>
              <p className="text-sm text-muted-foreground">
                Semantic embeddings let LLMs find tools by meaning — not just exact keywords. That means an assistant
                can locate a chess-analysis tool even if the tool author used the phrase "game evaluator".
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap size={18} /> Example workflows
              </CardTitle>
              <CardDescription>Real scenarios where NextBrowser hands actions to AI assistants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border">
                  <CardContent>
                    <h5 className="font-semibold">Chess Analysis</h5>
                    <p className="text-sm text-muted-foreground">User asks the assistant to analyze a live chess.com game.</p>
                    <CodeBlock>
{`// assistant finds tool: "chess-evaluator"
POST /tools/run
{ toolId: "chess-evaluator", inputs: { fen: "..." } }`}
                    </CodeBlock>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent>
                    <h5 className="font-semibold">Web Automation</h5>
                    <p className="text-sm text-muted-foreground">Auto-fill forms or scrape data via a browser-script tool.</p>
                    <CodeBlock>
{`// assistant triggers script via an execution adapter
POST /tools/run
{ toolId: "form-filler", inputs: { url: "...", data: {...} } }`}
                    </CodeBlock>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database size={18} /> Embeddings & Indexing
              </CardTitle>
              <CardDescription>How tools are made discoverable to LLMs.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each tool's metadata (name, description, tags, capabilities, and examples) is concatenated into a single
                document and converted into an embedding using a model. That vector is stored in a vector store
                (Pinecone / Weaviate / MongoDB Vector Search) for fast nearest-neighbor lookups.
              </p>

              <div className="mt-4">
                <CodeBlock>
{`// pseudo: create searchable text
const text = [name, description, tags.join(' '), capabilities.join(' ')].join('. ')
const emb = await embeddings.create({ input: text })
// save emb + metadata to vector db`}
                </CodeBlock>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Quick references & guides */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={16} /> Quick Start
              </CardTitle>
              <CardDescription>Publish a tool in 3 minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="text-sm list-decimal list-inside space-y-2">
                <li>Click <strong>Publish Tool</strong> and fill the metadata form.</li>
                <li>Provide a working API endpoint or script entrypoint.</li>
                <li>Include sample input/output and a short explanation.</li>
                <li>Submit — your tool will be indexed for semantic search.</li>
              </ol>
              <Button asChild>
                <a href="/upload">Publish a Tool</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch size={16} /> Developer Tips
              </CardTitle>
              <CardDescription>Make your tool AI-friendly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside">
                <li>Use descriptive names and tags.</li>
                <li>Include real-world examples in inputs/outputs.</li>
                <li>Make APIs idempotent and well-documented.</li>
                <li>Provide an auth flow (API key/OAuth) if needed.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">API Reference</CardTitle>
              <CardDescription className="text-sm">Minimal endpoints to interact with tools</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>
{`POST /api/tools
{ /* tool metadata */ }

POST /api/tools/search
{ query: "analyze chess game" }

POST /api/tools/run
{ toolId: "...", inputs: {...} }`}
              </CodeBlock>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>Want help publishing your first tool? Follow these steps.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold">1. Prepare</h4>
              <p className="text-sm text-muted-foreground">Write example inputs/outputs and a short description.</p>
            </div>
            <div>
              <h4 className="font-semibold">2. Publish</h4>
              <p className="text-sm text-muted-foreground">Fill the upload form and submit your tool.</p>
            </div>
            <div>
              <h4 className="font-semibold">3. Integrate</h4>
              <p className="text-sm text-muted-foreground">Call the tool from assistants via the run endpoint.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
