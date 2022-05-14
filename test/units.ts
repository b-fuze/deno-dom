const unitDir = new URL("units", import.meta.url);
await Promise.all(
  Array.from(Deno.readDirSync(unitDir))
    .filter((file) => file.isFile && file.name.endsWith(".ts"))
    .map((file) => import(`./units/${file.name}`)),
);
