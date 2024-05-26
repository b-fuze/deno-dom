import { DOMParser, Element } from "../../deno-dom-wasm.ts";
import {
  assertExists,
  assertStrictEquals as assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

Deno.test("Element.getElementsByTagName", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=main>
        <aside>
          <img>
          <article class=an-article>
            <p class=this-p>Foo bar baz</p>
          </article>
        </aside>
      </div>
    `,
    "text/html",
  );
  const divMain = doc.querySelector("div")!;
  const aside = divMain.getElementsByTagName("aside")[0];
  const article = divMain.getElementsByTagName("article")[0];

  assertExists(aside);
  assertExists(article);

  const img = article.previousElementSibling!;
  const mainP = divMain.getElementsByTagName("p")[0];
  const articleP = article.getElementsByTagName("P")[0];
  const articlePClass = article.getElementsByClassName("this-p")[0];

  assertExists(img);
  assertExists(mainP);
  assertExists(articleP);

  const imgParentArticle =
    (img!.parentElement! as Element).getElementsByTagName("article")[0];

  assertEquals(aside.tagName, "ASIDE");
  assertEquals(article.tagName, "ARTICLE");
  assertEquals(img.tagName, "IMG");
  assertEquals(mainP.tagName, "P");
  assertEquals(articleP.tagName, "P");
  assertEquals(articleP, articlePClass);
  assertEquals(mainP.parentNode, article);
  assertEquals(imgParentArticle, article);
});

Deno.test("Element.getElementsByClassName", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div class=main>
        <aside class=an-aside>
          <img>
          <article class=an-article>
            <p class=this-p>Foo bar baz</p>
          </article>
          <p class="a b c">working</p>
        </aside>
      </div>
    `,
    "text/html",
  );
  const divMain = doc.querySelector(".main")!;
  const aside = divMain.getElementsByClassName("an-aside")[0];
  const article = divMain.getElementsByClassName("an-article")[0];

  assertExists(aside);
  assertExists(article);

  const img = article.previousElementSibling!;
  const mainP = divMain.getElementsByClassName("this-p")[0];
  const articleP = article.getElementsByClassName("this-p")[0];

  assertExists(img);
  assertExists(mainP);
  assertExists(articleP);

  const imgParentArticle =
    (img!.parentElement! as Element).getElementsByClassName("an-article")[0];

  assertEquals(aside.tagName, "ASIDE");
  assertEquals(article.tagName, "ARTICLE");
  assertEquals(img.tagName, "IMG");
  assertEquals(mainP.tagName, "P");
  assertEquals(articleP.tagName, "P");
  assertEquals(mainP, articleP);
  assertEquals(mainP.parentNode, article);
  assertEquals(imgParentArticle, article);

  assertEquals(doc.getElementsByClassName("a c").length, 1);
  assertEquals(doc.getElementsByClassName("  a   b   ").length, 1);
  assertEquals(doc.getElementsByClassName("  a  dd b   ").length, 0);
  assertEquals(doc.getElementsByClassName("  a  c b   ").length, 1);
  assertEquals(doc.getElementsByClassName("c").length, 1);
  assertEquals(doc.getElementsByClassName("v").length, 0);
  assertEquals(doc.getElementsByClassName("a a b c b").length, 1);
});

Deno.test("Element.getElementById", () => {
  const doc = new DOMParser().parseFromString(
    `
      <div id=main>
        <aside id=an-aside>
          <img>
          <article id=an-article>
            <p id=this-p>Foo bar baz</p>
          </article>
        </aside>
      </div>
    `,
    "text/html",
  );
  const divMain = doc.querySelector("#main")!;
  const aside = divMain.getElementById("an-aside")!;
  const article = divMain.getElementById("an-article")!;

  assertExists(aside);
  assertExists(article);

  const img = article.previousElementSibling!;
  const mainP = divMain.getElementById("this-p")!;
  const articleP = article.getElementById("this-p")!;
  const articlePClass = article.getElementById("this-p")!;

  assertExists(img);
  assertExists(mainP);
  assertExists(articleP);

  const imgParentArticle = (img!.parentElement! as Element).getElementById(
    "an-article",
  );

  assertEquals(aside.tagName, "ASIDE");
  assertEquals(article.tagName, "ARTICLE");
  assertEquals(img.tagName, "IMG");
  assertEquals(mainP.tagName, "P");
  assertEquals(articleP.tagName, "P");
  assertEquals(articleP, articlePClass);
  assertEquals(mainP.parentNode, article);
  assertEquals(imgParentArticle, article);
});
