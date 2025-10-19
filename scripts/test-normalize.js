// Quick test harness for normalizeObjectsArray from route.ts
// This duplicates the normalization logic to run standalone in node

function normalizeObjectsArray(value, fieldName) {
  if (value === undefined || value === null) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      value = parsed;
    } catch {
      console.warn(
        `⚠️ Failed to JSON.parse ${
          fieldName || "value"
        } string; treating as primitive`
      );
      return [{ value: String(value) }];
    }
  }

  const results = [];
  const pushNormalized = (item) => {
    if (item === undefined || item === null) return;
    if (typeof item === "string") {
      try {
        const p = JSON.parse(item);
        pushNormalized(p);
        return;
      } catch {
        results.push({ value: item });
        return;
      }
    }
    if (Array.isArray(item)) {
      item.forEach(pushNormalized);
      return;
    }
    if (typeof item === "object") {
      const obj = item;
      const normalizedObj = {};
      Object.keys(obj).forEach((k) => {
        const v = obj[k];
        if (v === undefined || v === null) return;
        if (typeof v === "object") {
          try {
            normalizedObj[k] = JSON.stringify(v);
          } catch {
            normalizedObj[k] = String(v);
          }
        } else {
          normalizedObj[k] = String(v);
        }
      });
      results.push(normalizedObj);
      return;
    }
    results.push({ value: String(item) });
  };

  pushNormalized(value);
  return results;
}

// Simulate the failing payload: inputs as an array with a stringified object
const payload = {
  inputs: [
    '[{ "name": "play", "type": "play", "description": "play", "example": "play" }]',
  ],
  outputs: [
    '[{ "name": "play", "type": "play", "description": "play", "example": "play" }]',
  ],
};

console.log("Original inputs:", payload.inputs);
console.log(
  "Normalized inputs:",
  normalizeObjectsArray(payload.inputs, "inputs")
);
console.log("Original outputs:", payload.outputs);
console.log(
  "Normalized outputs:",
  normalizeObjectsArray(payload.outputs, "outputs")
);

// Case B: single-quoted JS-style string (like the error shows)
const payloadB = {
  inputs: [
    "[\n  {\n    name: 'version',\n    type: 'version',\n    description: 'version',\n    example: 'version'\n  }\n]",
  ],
  outputs: [
    "[\n  {\n    name: 'versionversion',\n    type: 'version',\n    description: 'version',\n    example: 'version'\n  }\n]",
  ],
};

console.log("\nOriginal inputs (B):", payloadB.inputs);
console.log(
  "Normalized inputs (B):",
  normalizeObjectsArray(payloadB.inputs, "inputs")
);
console.log("Original outputs (B):", payloadB.outputs);
console.log(
  "Normalized outputs (B):",
  normalizeObjectsArray(payloadB.outputs, "outputs")
);
