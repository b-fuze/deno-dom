import { nodesFromString } from "../deno-dom-native.ts";

async function readAllString(reader: Deno.Reader, bufSize = 4096): Promise<string> {
  const decoder = new TextDecoder();
  const buffer = new Uint8Array(bufSize);
  let accum = "";
  let size: number | null = null;

  while ((size = await reader.read(buffer)) !== null) {
    accum += decoder.decode(buffer.subarray(0, <number> <unknown> size));
  }

  return accum;
}

const quiet = Deno.args[0] === "-q";
const nodes = nodesFromString(await readAllString(Deno.stdin));

if (!quiet) {
  console.dir(nodes, { depth: Infinity });
}

