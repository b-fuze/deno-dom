/**
 * @module
 *
 * This module exposes the Deno DOM API with the native binary backend.
 * Unlike the WASM backend the native backend requires more permissions
 * due to the nature of how native bindings work. They include:
 *
 * - `--unstable-ffi`
 * - `--allow-ffi`
 * - `--allow-env`
 * - `--allow-read`
 * - `--allow-net=deno.land`
 *
 * @example
 * ```ts
 * import { DOMParser, initParser } from "jsr:@b-fuze/deno-dom/native";
 *
 * // ...and when you need Deno DOM make sure you initialize the parser...
 * await initParser();
 *
 * // Then you can use Deno DOM as you would normally
 * const doc = new DOMParser().parseFromString(
 *   `
 *     <h1>Hello World!</h1>
 *     <p>Hello from <a href="https://deno.land/">Deno!</a></p>
 *   `,
 *   "text/html",
 * );
 *
 * const p = doc.querySelector("p")!;
 * console.log(p.textContent); // "Hello from Deno!"
 * ```
 */

import { dlopen } from "jsr:@denosaurs/plug@1.1.0";
import { register } from "./src/parser.ts";

const nativeEnv = "DENO_DOM_PLUGIN";
let denoNativePluginPath: string | undefined;

// Try to read the environment
try {
  denoNativePluginPath = Deno.env.get(nativeEnv);
} catch {}

// These types are only to deal with `as const` `readonly` shenanigans
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
const _symbols = {
  deno_dom_usize_len: { parameters: [], result: "usize" },
  deno_dom_parse_sync: {
    parameters: ["buffer", "usize", "buffer"],
    result: "void",
  },
  deno_dom_parse_frag_sync: {
    parameters: ["buffer", "usize", "buffer", "usize", "buffer"],
    result: "void",
  },
  deno_dom_is_big_endian: { parameters: [], result: "u32" },
  deno_dom_copy_buf: { parameters: ["buffer", "buffer"], result: "void" },
} as const;
const symbols = _symbols as DeepWriteable<typeof _symbols>;

let dylib: Deno.DynamicLibrary<typeof symbols>;

if (denoNativePluginPath) {
  // Load the plugin locally
  dylib = Deno.dlopen(denoNativePluginPath, symbols);
} else {
  const host = `${Deno.build.os}-${Deno.build.arch}` as const;
  let name = "";

  switch (host) {
    case "linux-x86_64":
    case "darwin-x86_64":
    case "windows-x86_64":
      name = "plugin";
      break;

    case "linux-aarch64":
      name = "plugin-linux-aarch64";
      break;

    default:
      console.error(`deno-dom-native: host ${host} has no supported backend`);
      Deno.exit(1);
  }

  // Download the plugin
  dylib = await dlopen({
    name,
    url:
      "https://github.com/b-fuze/deno-dom/releases/download/v0.1.41-alpha-artifacts/",
  }, symbols);
}

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const usizeBytes = Number(dylib.symbols.deno_dom_usize_len());
const isBigEndian = Boolean(dylib.symbols.deno_dom_is_big_endian() as number);

const dylibParseSync = dylib.symbols.deno_dom_parse_sync.bind(dylib.symbols);
const dylibParseFragSync = dylib.symbols.deno_dom_parse_frag_sync.bind(
  dylib.symbols,
);

// Reused for each invocation. Not thread safe, but JS isn't multithreaded
// anyways.
const returnBufSizeLenRaw = new ArrayBuffer(usizeBytes * 2);
const returnBufSizeLen = new Uint8Array(returnBufSizeLenRaw);

type DocumentParser = (
  srcBuf: Uint8Array,
  srcLength: bigint,
  returnBuf: Uint8Array,
) => void;
type FragmentParser = (
  srcBuf: Uint8Array,
  srcLength: bigint,
  contextLocalNameBuf: Uint8Array,
  contextLocalNameLength: bigint,
  returnBuf: Uint8Array,
) => void;

function genericParse(
  parser: DocumentParser | FragmentParser,
  srcHtml: string,
  contextLocalName?: string,
): string {
  const encodedHtml = utf8Encoder.encode(srcHtml);
  if (contextLocalName) {
    const encodedContextLocalName = utf8Encoder.encode(contextLocalName);
    (parser as FragmentParser)(
      encodedHtml,
      BigInt(encodedHtml.length),
      encodedContextLocalName,
      BigInt(encodedContextLocalName.length),
      returnBufSizeLen,
    );
  } else {
    (parser as DocumentParser)(
      encodedHtml,
      BigInt(encodedHtml.length),
      returnBufSizeLen,
    );
  }

  const outBufSize = Number(
    new DataView(returnBufSizeLenRaw).getBigUint64(0, !isBigEndian),
  );
  const outBuf = new Uint8Array(outBufSize);
  dylib.symbols.deno_dom_copy_buf(returnBufSizeLen.slice(usizeBytes), outBuf);

  return utf8Decoder.decode(outBuf);
}

function parse(html: string): string {
  return genericParse(dylibParseSync, html);
}

function parseFrag(html: string, contextLocalName?: string): string {
  return genericParse(dylibParseFragSync, html, contextLocalName);
}

// Register parse function
register(parse, parseFrag);

export * from "./src/api.ts";
