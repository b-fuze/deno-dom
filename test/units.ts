import { dirname, join } from "path";

const unitDir = join(dirname(new URL(import.meta.url).pathname), "units");
const units = Array.from(Deno.readDirSync(unitDir))
  .filter((file) => file.isFile && file.name.endsWith(".ts"))
  .map((file) => join("units", file.name));

// Change into the unitDir
Deno.chdir(unitDir);

// Import all unit files
for (const file of units) {
  await import("./" + file);
}
