import { register } from "./src/parser.ts";

const nativeEnv = "DENO_DOM_EXECUTABLE";
const denoNativePluginPath = Deno.env.get(nativeEnv);

if (!denoNativePluginPath) {
  console.error("Missing required environment variable " + nativeEnv);
  Deno.exit(1);
}

// Open native plugin and register the native `parse` function
Deno.openPlugin(denoNativePluginPath);

type pluginId = number;
interface DenoCore {
  ops(): {
    [opName: string]: number;
  };
  dispatch(plugin: pluginId, ...data: Uint8Array[]): Uint8Array;
};

const core = <DenoCore> (<any> <unknown> Deno).core;
const { denoDomParseSync } = core.ops();

const encoder = new TextEncoder();
const decoder = new TextDecoder();
function parse(html: string): string {
  return decoder.decode(core.dispatch(denoDomParseSync, encoder.encode(html)));
}

// Register parse function
register(parse);

export { nodesFromString } from "./src/deserialize.ts";
export * from "./src/dom/node.ts";
export * from "./src/dom/element.ts";

