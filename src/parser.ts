/**
 * Parser interface
 */
export type Parser = (html: string) => string;
export let parse: Parser = (_html) => {
  console.error("Error: deno-dom: No parser registered");
  Deno.exit(1);
};

export function register(func: Parser) {
  parse = func;
}

