///<reference lib="deno.worker" />
type TestSetupEvent = {
  data: {
    backend: "wasm" | "native";
    html: string;
    scripts: string[];
  };
};

addEventListener("message", async (event) => {
  const { data: { backend, html, scripts } } = event as any as TestSetupEvent;
  const denoDom = await import("../deno-dom-" + backend + ".ts");
  const { DOMParser, Comment } = denoDom;

  (self as any).window = self;
  (self as any).parent = self;
  Object.defineProperty(self, "location", {
    value: {
      href: import.meta.url,
      pathname: import.meta.url,
      protocol: "file:",
      host: "testmachine",
      hostname: "testmachine",
      port: "",
      search: "",
      hash: "",
      origin: "",
    },
  });
  const doc = new DOMParser().parseFromString(html, "text/html")!;
  (self as any).window.document = doc;

  for (const item of Object.keys(denoDom)) {
    (self as any)[item] = denoDom[item];
  }

  // Assign anything with an ID to `window`
  for (const element of doc.querySelectorAll("[id]")) {
    const id = element.getAttribute("id");

    if (!(id in self)) {
      (self as any)[id] = element;
    }
  }

  // Run scripts
  new Function(scripts.join("\n\n"))();

  // Add fake XML document implementation to skip XML doc tests
  doc.implementation.createDocument = function (
    ns: any,
    qualifiedName: any,
    documentType: any,
  ) {
    const newDoc = doc.implementation.createHTMLDocument();

    // Return comments instead of PI's
    newDoc.createProcessingInstruction = function (...args: any[]) {
      return new Comment(args[0]);
    };
  };

  postMessage({
    success: true,
  });
});
