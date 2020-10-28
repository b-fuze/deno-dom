type TestSetupEvent = {
  data: {
    backend: "wasm" | "native";
    html: string;
    scripts: string[];
  }
};

addEventListener("message", async event => {
  const { data: { backend, html, scripts } } = event as any as TestSetupEvent;
  const denoDom = await import("../deno-dom-" + backend + ".ts");
  const { DOMParser } = denoDom;

  (self as any).window = self;
  (self as any).parent = self;
  (self as any).location = {
    href: import.meta.url,
    pathname: import.meta.url,
    protocol: "file:",
    host: "testmachine",
    hostname: "testmachine",
    port: "",
    search: "",
    hash: "",
    origin: "",
  };
  const doc = new DOMParser().parseFromString(html, "text/html")!;
  (self as any).window.document = doc;

  for (const item of Object.keys(denoDom)) {
    (self as any)[item] = denoDom[item];
  }

  for (const script of scripts) {
    new Function(script)()
  }

  postMessage({
    success: true,
  });
});

