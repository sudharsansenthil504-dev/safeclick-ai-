import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
assert.equal(scripts.length, 3, "Expected the three application scripts");

class MockElement {
  constructor(id = "") {
    this.id = id;
    this.value = "";
    this.dataset = {};
    this.attributes = {};
    this.events = {};
    this.children = [];
    this.classes = new Set();
    this.classList = {
      add: (name) => this.classes.add(name),
      remove: (name) => this.classes.delete(name),
      contains: (name) => this.classes.has(name),
    };
  }
  addEventListener(name, callback) { this.events[name] = callback; }
  setAttribute(name, value) { this.attributes[name] = value; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  scrollIntoView() {}
  closest() { return new MockElement("checker"); }
  get textContent() {
    return this.children.map((child) => typeof child === "string" ? child : child?.textContent ?? "").join("");
  }
  set textContent(value) { this.children = [String(value)]; }
}

const ids = [
  "messageBtn", "messageText", "messageResult",
  "jobBtn", "jobText", "jobResult",
  "linkBtn", "linkText", "linkResult",
  "languageSelect", "languageLabel",
];
const elements = Object.fromEntries(ids.map((id) => [id, new MockElement(id)]));
const document = {
  documentElement: { lang: "en", dir: "ltr" },
  getElementById(id) { return elements[id] ??= new MockElement(id); },
  querySelectorAll() { return []; },
  createElement(tag) { return new MockElement(tag); },
  createTextNode(text) { return { textContent: String(text) }; },
};
let alertCount = 0;
const localStorage = { getItem: () => null, setItem: () => {} };
const context = vm.createContext({
  document,
  localStorage,
  URL,
  alert: () => { alertCount += 1; },
  confirm: () => true,
  console,
});

for (const [index, script] of scripts.entries()) {
  assert.doesNotThrow(
    () => vm.runInContext(script, context, { filename: `index.html:inline-script-${index + 1}` }),
    `Inline script ${index + 1} should initialize without runtime errors`,
  );
}

const click = (buttonId) => {
  assert.equal(typeof elements[buttonId].events.click, "function", `${buttonId} click handler is registered`);
  elements[buttonId].events.click();
};
const assertVisible = (resultId) => {
  assert.equal(elements[resultId].classList.contains("show"), true, `${resultId} should become visible`);
  assert.ok(elements[resultId].children.length >= 3, `${resultId} should contain rendered result content`);
};

elements.messageText.value = "Hi Customer, apply for Tata Neu SBI Card (Neucard) TODAY & get effective first year free. https://m.tneu.in/TNSBIC/ZR21Sjl T&Cs apply.";
click("messageBtn");
assertVisible("messageResult");

elements.jobText.value = "You are selected. Pay a registration fee to receive this work from home job.";
click("jobBtn");
assertVisible("jobResult");

elements.linkText.value = "https://m.tneu.in/TNSBIC/ZR21Sjl";
click("linkBtn");
assertVisible("linkResult");

elements.messageText.value = "உங்கள் கணக்கு முடக்கப்படும். உடனே சரிபார்க்கவும்.";
click("messageBtn");
assertVisible("messageResult");

elements.messageText.value = "<img src=x onerror=alert(1)>";
click("messageBtn");
assertVisible("messageResult");
assert.equal(Object.hasOwn(elements.messageResult.children[0], "innerHTML"), false, "Results must not use an HTML injection sink");

elements.messageText.value = "";
click("messageBtn");
assert.equal(alertCount, 1, "Empty input should show one validation alert");

const languageCodes = ["en", "ta", "hi", "te", "kn", "ml", "bn", "mr", "gu", "pa", "ur"];
for (const code of languageCodes) {
  elements.languageSelect.value = code;
  elements.languageSelect.events.change();
  assert.equal(document.documentElement.lang, code, `${code} language should initialize`);
  assert.equal(document.documentElement.dir, code === "ur" ? "rtl" : "ltr");
}

const emergencyKeys = vm.runInContext(
  '["emergencyTitle","emergencyDesc","emergencyCall","emergencyPortal"].every((key) => Object.hasOwn(extraWords.en, key))',
  context,
);
assert.equal(emergencyKeys, true, "Emergency help translations should initialize without missing keys");

console.log("SafeClick AI smoke tests passed: script initialization, message/job/link results, Tamil clue, safe text rendering, empty input, 11 languages, Urdu RTL, and emergency translations.");
