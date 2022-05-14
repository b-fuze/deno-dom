import { parse, parseFrag } from "./parser.ts";
import { CTOR_KEY } from "./constructor-lock.ts";
import { Comment, Node, NodeType, Text } from "./dom/node.ts";
import { DocumentType } from "./dom/document.ts";
import { DocumentFragment } from "./dom/document-fragment.ts";
import { HTMLTemplateElement } from "./dom/elements/html-template-element.ts";
import { Element } from "./dom/element.ts";
import { HTMLElement } from "./dom/elements/html/html-element.ts";

export function nodesFromString(html: string): Node {
  const parsed = JSON.parse(parse(html));
  const node = nodeFromArray(parsed, null);

  return node;
}

export function fragmentNodesFromString(html: string): Node {
  const parsed = JSON.parse(parseFrag(html));
  const node = nodeFromArray(parsed, null);

  return node;
}

const validHTMLElementNames = [
  "html",
  "base",
  "head",
  "link",
  "meta",
  "style",
  "title",
  "body",
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "main",
  "nav",
  "section",
  "blockquote",
  "dd",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "hr",
  "li",
  "menu",
  "ol",
  "p",
  "pre",
  "ul",
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
  "area",
  "audio",
  "img",
  "map",
  "track",
  "video",
  "embed",
  "iframe",
  "object",
  "picture",
  "portal",
  "source",
  "canvas",
  "noscript",
  "script",
  "del",
  "ins",
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "button",
  "datalist",
  "fieldset",
  "form",
  "input",
  "label",
  "legend",
  "optgroup",
  "option",
  "output",
  "progresss",
  "select",
  "textarea",
  "details",
  "dialog",
  "summary",
  "slot",
  "template",
  "svg",
  "math",
];

const nodeNameMap = {
  "HTMLHtmlElement": ["html"],
  "HTMLBaseElement": ["base"],
  "HTMLHeadElement": ["head"],
  "HTMLLinkElement": ["link"],
  "HTMLMetaElement": ["meta"],
  "HTMLStyleElement": ["style"],
  "HTMLTitleElement": ["title"],
  "HTMLBodyElement": ["body"],
  "HTMLElement": [
    "address",
    "article",
    "aside",
    "footer",
    "header",
    "main",
    "nav",
    "section",
    "dd",
    "dt",
    "figcaption",
    "figure",
    "abbr",
    "b",
    "bdi",
    "bdo",
    "cite",
    "code",
    "dfn",
    "em",
    "i",
    "kbd",
    "mark",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "small",
    "strong",
    "sub",
    "sup",
    "u",
    "var",
    "wbr",
    "noscript",
    "summary",
  ],
  "HTMLHeadingElement": [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  "HTMLQuoteElement": [
    "blockquote",
    "q",
  ],
  "HTMLDivElement": ["div"],
  "HTMLDListElement": ["dl"],
  "HTMLHRElement": ["hr"],
  "HTMLLIElement": ["li"],
  "HTMLMenuElement": ["menu"],
  "HTMLOListElement": ["ol"],
  "HTMLParagraphElement": ["p"],
  "HTMLPreElement": ["pre"],
  "HTMLUListElement": ["ul"],
  "HTMLAnchorElement": ["a"],
  "HTMLBRElement": ["br"],
  "HTMLDataElement": ["data"],
  "HTMLSpanElement": ["span"],
  "HTMLTimeElement": ["time"],
  "HTMLAreaElement": ["area"],
  "HTMLAudioElement": ["audio"],
  "HTMLImageElement": ["img"],
  "HTMLMapElement": ["map"],
  "HTMLTrackElement": ["track"],
  "HTMLVideoElement": ["video"],
  "HTMLEmbedElement": ["embed"],
  "HTMLIFrameElement": ["iframe"],
  "HTMLObjectElement": ["object"],
  "HTMLPictureElement": ["picture"],
  "HTMLUnknownElement": [
    "portal",
    "progresss",
    "svg",
    "math",
  ],
  "HTMLSourceElement": ["source"],
  "HTMLCanvasElement": ["canvas"],
  "HTMLScriptElement": ["script"],
  "HTMLModElement": [
    "del",
    "ins",
  ],
  "HTMLTableCaptionElement": ["caption"],
  "HTMLTableColElement": [
    "col",
    "colgroup",
  ],
  "HTMLTableElement": ["table"],
  "HTMLTableSectionElement": [
    "tbody",
    "tfoot",
    "thead",
  ],
  "HTMLTableCellElement": [
    "td",
    "th",
  ],
  "HTMLTableRowElement": ["tr"],
  "HTMLButtonElement": ["button"],
  "HTMLDataListElement": ["datalist"],
  "HTMLFieldSetElement": ["fieldset"],
  "HTMLFormElement": ["form"],
  "HTMLInputElement": ["input"],
  "HTMLLabelElement": ["label"],
  "HTMLLegendElement": ["legend"],
  "HTMLOptGroupElement": ["optgroup"],
  "HTMLOptionElement": ["option"],
  "HTMLOutputElement": ["output"],
  "HTMLSelectElement": ["select"],
  "HTMLTextAreaElement": ["textarea"],
  "HTMLDetailsElement": ["details"],
  "HTMLDialogElement": ["dialog"],
  "HTMLSlotElement": ["slot"],
  "HTMLTemplateElement": ["template"],
};

function nodeFromArray(data: any, parentNode: Node | null): Node {
  // For reference only:
  // type node = [NodeType, nodeName, attributes, node[]]
  //             | [NodeType, characterData]

  // <template> element gets special treatment, until
  // we implement all the HTML elements
  if (nodeNameMap.HTMLTemplateElement.includes(data[1])) {
    const content = nodeFromArray(data[3], null);
    const contentFrag = new DocumentFragment();
    const fragMutator = contentFrag._getChildNodesMutator();

    for (const child of content.childNodes) {
      fragMutator.push(child);
      child._setParent(contentFrag);
    }

    return new HTMLTemplateElement(
      parentNode,
      data[2],
      CTOR_KEY,
      contentFrag,
    );
  }

  const elm = (
    validHTMLElementNames.includes(data[1])
      ? new HTMLElement(data[1], parentNode, data[2], CTOR_KEY)
      : new Element(data[1], parentNode, data[2], CTOR_KEY)
  );
  const childNodes = elm._getChildNodesMutator();
  let childNode: Node;

  for (const child of data.slice(3)) {
    switch (child[0]) {
      case NodeType.TEXT_NODE:
        childNode = new Text(child[1]);
        childNode.parentNode = childNode.parentElement = elm;
        childNodes.push(childNode);
        break;

      case NodeType.COMMENT_NODE:
        childNode = new Comment(child[1]);
        childNode.parentNode = childNode.parentElement = elm;
        childNodes.push(childNode);
        break;

      case NodeType.DOCUMENT_NODE:
      case NodeType.ELEMENT_NODE:
        nodeFromArray(child, elm);
        break;

      case NodeType.DOCUMENT_TYPE_NODE:
        childNode = new DocumentType(child[1], child[2], child[3], CTOR_KEY);
        childNode.parentNode = childNode.parentElement = elm;
        childNodes.push(childNode);
        break;
    }
  }

  return elm;
}
