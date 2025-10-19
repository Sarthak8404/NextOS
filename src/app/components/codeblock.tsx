"use client";

import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export function CodeBlockDemo() {
  const code = `{
  {
  "toolId": "tl_8921ff",
  "name": "DataCleaner",
  "api": "https://api.devtools.ai/v1/clean",
  "methods": [
    "normalizeText",
  ],
  "llm_usage": "Prepro text before embedding",
  "inputs": {
    "text": "string",
    "lang": "en | fr | de"
  },
  "outputs": {
    "tokens": "array<int>",
    "meta": "object"
  },
  "use_cases": [
    "Chatbots",
    "Search Indexing"
  ]
}`;

  return (
    <div className="w-full h-full rounded-2xl py-1 px-1
 shadow-lg border border-gray-700" style={{ backgroundColor: "#0e162b" }}>
      <CodeBlock
        language="json"
        filename="tool-schema.json"
        highlightLines={[6, 7, 9]}
        code={code}
      />
    </div>
  );
}
