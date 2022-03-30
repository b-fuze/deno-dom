import { Plug } from "https://deno.land/x/plug/mod.ts";
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
    parameters: ["pointer", "usize", "pointer"],
    result: "void",
  },
  deno_dom_parse_frag_sync: {
    parameters: ["pointer", "usize", "pointer"],
    result: "void",
  },
  deno_dom_is_big_endian: { parameters: [], result: "u32" },
  deno_dom_copy_buf: { parameters: ["pointer", "pointer"], result: "void" },
} as const;
const symbols = _symbols as DeepWriteable<typeof _symbols>;

let dylib: Deno.DynamicLibrary<typeof symbols>;

if (denoNativePluginPath) {
  // Load the plugin locally
  dylib = Deno.dlopen(denoNativePluginPath, symbols);
} else {
  // Download the plugin
  dylib = await Plug.prepare({
    name: "plugin",
    url: "https://github.com/b-fuze/deno-dom/releases/download/v0.1.17-alpha/",
  }, symbols);
}

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const usizeBytes = dylib.symbols.deno_dom_usize_len() as number;
const isBigEndian = Boolean(dylib.symbols.deno_dom_is_big_endian() as number);

const dylibParseSync = dylib.symbols.deno_dom_parse_sync.bind(dylib.symbols);
const dylibParseFragSync = dylib.symbols.deno_dom_parse_frag_sync.bind(
  dylib.symbols,
);

// Reused for each invocation. Not thread safe, but JS isn't multithreaded
// anyways.
const returnBufSizeLenRaw = new ArrayBuffer(usizeBytes * 2);
const returnBufSizeLen = new Uint8Array(returnBufSizeLenRaw);

function genericParse(
  parser: (
    srcBuf: Uint8Array,
    srcLength: number,
    returnBuf: Uint8Array,
  ) => void,
  srcHtml: string,
): string {
  const encodedHtml = utf8Encoder.encode(srcHtml);
  parser(encodedHtml, encodedHtml.length, returnBufSizeLen);

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

function parseFrag(html: string): string {
  return genericParse(dylibParseFragSync, html);
}

// Register parse function
register(parse, parseFrag);

export * from "./src/api.ts";
