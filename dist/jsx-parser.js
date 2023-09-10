import { generateElementId } from "./events";

const parseCustom = [ "key" ];

export function h(tag, attrs, children) {
  let isCustom = (typeof tag == "function");
  let isFragment = isCustom && tag.name == "Fragment";
  if (!attrs) attrs = {}
  attrs.children = children;

  let element = null;
  if (isCustom && !isFragment) element = tag(attrs);
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
      element.setAttribute(name, (value === true) ? value : value.toString());
    }
  }

  if (!isCustom || isFragment) {
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      element.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
    }
  }

  return element;
}

// TODO: Improve Fragments
export function Fragment({ children }) {
  return children;
}