import { registerElementReference, handleKeyEvent } from "../dist/events";

const parseCustom = ["key", "ref", "preserve"];
const skipAttributes = ["events"];

export function h(tag, attrs, children) {
  let isCustom = (typeof tag == "function");
  let isFragment = isCustom && tag.name == "Fragment";
  if (!attrs) attrs = {}
  attrs.children = children;

  let element = null;
  if (isCustom && !isFragment) {
    element = tag(attrs);
    // Add a ref tag for the preserve keyword on custom elements
    if (element.nodeType != 11) element.setAttribute("ref", registerElementReference(tag));
  }
  else if (isFragment) element = new DocumentFragment();
  else element = document.createElement(tag);

  if (!element) {
    console.error("Tag is invalid, or custom Element returns null");
    element = document.createElement("div");
  }

  for (let name in attrs) {
    if (name && attrs.hasOwnProperty(name)) {
      if (name == "children") continue;
      if (isCustom && !parseCustom.includes(name)) continue;
      let value = attrs[name];
      if (name == "style" && typeof value == "object") element.setAttribute(name, parseStyles(value));
      //else if (name == "key") document.addEventListener("click", (e) => handleKeyEvent(e))
      else element.setAttribute(name, (value === true) ? value : value.toString());
    }
  }

  if (!isCustom || isFragment) {
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      if (!child) child = document.createTextNode(`${child}`);
      element.appendChild(child?.nodeType == null ? document.createTextNode(child.toString()) : child);
    }
  }

  return element;
}

// TODO: Improve Fragments
export function Fragment({ children }) {
  return children;
}

function parseStyles(style) {
  let res = "";
  for (const property in style) {
    let cssProp = property.replace(/[A-Z][a-z]*/g, str => '-' + str.toLowerCase() + '-')
      .replace('--', '-') // remove double hyphens
      .replace(/(^-)|(-$)/g, ''); // remove hyphens at the beginning and the end
    res += `${cssProp}: ${style[property]};`;
  }
  return res;
}