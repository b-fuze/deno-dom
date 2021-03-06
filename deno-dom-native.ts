import {
  prepare,
  PerpareOptions,
} from "https://raw.githubusercontent.com/b-fuze/deno-plugin-prepare/master/mod.ts";
import { register } from "./src/parser.ts";

const nativeEnv = "DENO_DOM_PLUGIN";
let denoNativePluginPath: string | undefined;

// Try to read the environment
try {
  denoNativePluginPath = Deno.env.get(nativeEnv);
} catch {}

if (denoNativePluginPath) {
  // Open native plugin and register the native `parse` function
  Deno.openPlugin(denoNativePluginPath);
} else {
  const releaseUrl = "https://github.com/b-fuze/deno-dom/releases/download/v0.1.12-alpha";
  const pluginOptions: PerpareOptions = {
    name: "test_plugin",

    // Whether to output log. Optional, default is true
    printLog: false,

    // Whether to use locally cached files. Optional, default is true
    // checkCache: true,

    // Support "http://", "https://", "file://"
    urls: {
      darwin: releaseUrl + "/libplugin.dylib",
      windows: releaseUrl + "/plugin.dll",
      linux: releaseUrl + "/libplugin.so",
    },
  };

  await prepare(pluginOptions);
}

interface DenoCore {
  opSync(op: string, data1?: unknown, data2?: unknown): unknown;
};

const core = <DenoCore> (<any> <unknown> Deno).core;

function parse(html: string): string {
  return core.opSync("deno_dom_parse_sync", html) as string;
}

function parseFrag(html: string): string {
  return core.opSync("deno_dom_parse_frag_sync", html) as string;
}

// Register parse function
register(parse, parseFrag);

export * from "./src/api.ts";

