// Standalone test of tryParseLooseJSON and normalizeObjectsArray

function tryParseLooseJSON(str) {
  if (typeof str !== "string") return null;
  // Try strict JSON first
  try {
    return JSON.parse(str);
  } catch {}

  // Heuristic 1: try to convert common JS-literal forms to JSON
  try {
    let s = String(str).trim();
    s = s.replace(/\r?\n/g, " ");
    s = s.replace(/'([^']*)'/g, '"$1"');
    s = s.replace(/([{,]\s*)([A-Za-z0-9_@$]+)\s*:/g, '$1"$2":');
    s = s.replace(/,\s*(}[,\]]?)/g, "$1");
    s = s.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(s);
  } catch {}

  // Heuristic 2: try to evaluate as a JS literal (last resort). Use Function with parentheses to ensure expression parsing.
  try {
    const fn = new Function('"use strict"; return (' + str + ")");
    return fn();
  } catch {}

  // Heuristic 3: regex-based extraction of JS-style object literals
  try {
    const s = String(str);
    const objects = [];
    const objRegex = /\{([^}]*)\}/g;
    let m = null;
    while ((m = objRegex.exec(s)) !== null) {
      const body = m[1];
      const obj = {};
      const kvRegex = /([A-Za-z0-9_@$]+)\s*:\s*(['"`])([\s\S]*?)\2/g;
      let km = null;
      while ((km = kvRegex.exec(body)) !== null) {
        const key = km[1];
        const val = km[3].trim();
        obj[key] = val;
      }
      if (Object.keys(obj).length) objects.push(obj);
    }
    if (objects.length === 1) return objects[0];
    if (objects.length > 1) return objects;
  } catch {}

  return null;
}

function normalizeObjectsArray(value) {
  if (value === undefined || value === null) return [];
  if (typeof value === "string") {
    const parsed = tryParseLooseJSON(value);
    if (parsed !== null) {
      value = parsed;
    } else {
      value = [String(value)];
    }
  }
  if (!Array.isArray(value)) value = [value];
  const arr = value.flatMap((item) => {
    if (item === undefined || item === null) return [];
    if (Array.isArray(item)) {
      return item.flatMap((sub) => {
        if (sub === undefined || sub === null) return [];
        if (typeof sub === "object") return [sub];
        if (typeof sub === "string") {
          const p = tryParseLooseJSON(sub);
          if (p !== null) {
            if (Array.isArray(p))
              return p.map((x) =>
                typeof x === "object" ? x : { value: String(x) }
              );
            return [p];
          }
          return [{ value: String(sub) }];
        }
        return [{ value: String(sub) }];
      });
    }
    if (typeof item === "object") return [item];
    if (typeof item === "string") {
      const parsed = tryParseLooseJSON(item);
      if (parsed !== null) {
        if (Array.isArray(parsed))
          return parsed.map((x) =>
            typeof x === "object" ? x : { value: String(x) }
          );
        return [parsed];
      }
      return [{ value: String(item) }];
    }
    return [{ value: String(item) }];
  });
  return arr.map((el) => (typeof el === "object" ? el : { value: String(el) }));
}

const testA =
  '[{ "name": "play", "type": "play", "description": "play", "example": "play" }]';
const testB = `[
  {
    name: 'version',
    type: 'version',
    description: 'version',
    example: 'version'
  }
]`;

console.log("tryParse A =>", tryParseLooseJSON(testA));
console.log("normalize A =>", normalizeObjectsArray(testA));
console.log("tryParse B =>", tryParseLooseJSON(testB));
console.log("normalize B =>", normalizeObjectsArray(testB));
