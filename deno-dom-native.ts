import {
  prepare,
  PerpareOptions,
} from "https://raw.githubusercontent.com/b-fuze/deno-plugin-prepare/master/mod.ts";
import { register } from "./src/parser.ts";

const nativeEnv = "DENO_DOM_EXECUTABLE";
const denoNativePluginPath = Deno.env.get(nativeEnv);

if (denoNativePluginPath) {
  // Open native plugin and register the native `parse` function
  Deno.openPlugin(denoNativePluginPath);
} else {
  const releaseUrl = "https://github.com/b-fuze/deno-dom/releases/download/v0.1.1-alpha";
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

type pluginId = number;
interface DenoCore {
  ops(): {
    [opName: string]: number;
  };
  dispatch(plugin: pluginId, ...data: Uint8Array[]): Uint8Array;
};

const core = <DenoCore> (<any> <unknown> Deno).core;
const { denoDomParseSync, denoDomParseFragSync } = core.ops();

const encoder = new TextEncoder();
const decoder = new TextDecoder();
function parse(html: string): string {
  return decoder.decode(core.dispatch(denoDomParseSync, encoder.encode(html)));
}

function parseFrag(html: string): string {
  return decoder.decode(core.dispatch(denoDomParseFragSync, encoder.encode(html)));
}

// Register parse function
register(parse, parseFrag);

export * from "./src/api.ts";

