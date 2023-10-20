import { createEffect } from "./app/reactivity.js";
import { Logger } from "./tools/logger.js";

const logger = new Logger("JSX runtime");

const parseCustom = ["key", "ref", "preserve"];
const skipCustom = ["children"];

/* {
  tag: "p",
  attrs: {},
  children: []
} */

export function h(tag, attrs, ...children) {
  let isFragment = tag.isFragment == true;
  const isCustom = (typeof tag == "function") && !isFragment;
  const isElement = !isFragment && !isCustom;

  /** @type {HTMLElement | null} */
  let element = null;
  attrs ??= {};
  attrs.children = children;

  if (isElement) element = document.createElement(tag);
  else if (isCustom) element = tag(attrs);
  else if (isFragment) {
    const data = tag(attrs);
    element = data.children ?? data;
  }
  else logger.error("Something went wrong while parsing the tag information");

  if (Array.isArray(element)) isFragment = true;

  if (!isFragment) {
    for (let name in attrs) {
      const value = attrs[name];

      if (skipCustom.includes(name) || (isCustom && !parseCustom.includes(name) && !event(name))) continue;
      else if (event(name)) registerElementEventListener(element, event(name), value);
      else {
        if (name == "style" && typeof value == "object") style(element, value);
        else if (name == "ref") {
          if (typeof value == "function") value(element);
          else if (typeof value == "object") value.current = element;
        }
        else if (typeof value == "function") createEffect(() => element.setAttribute(property(name), value()));
        else element.setAttribute(property(name), value);
      }
    }
  }

  if (!isCustom) {
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (!isFragment && child != null) handleChild(element, child)
    }
  }

  return element;
}

/** @param {object} attrs */
export const Fragment = (attrs) => {
  return attrs;
}
Fragment.isFragment = true;

/** @param {string} prop */
function event(prop) {
  const event = prop.toLowerCase();
  if (!event.startsWith("on")) return false;
  return event.replace("on", "");
}

/** @param {string} prop */
function property(prop) {
  if (prop.toLowerCase() == "classname") return "class";
  return prop;
}

/** @param {HTMLElement} element */
function style(element, style) {
  let res = {};
  for (const property in style) {
    let cssProp = property.replace(/[A-Z][a-z]*/g, str => '-' + str.toLowerCase() + '-')
      .replace('--', '-') // remove double hyphens
      .replace(/(^-)|(-$)/g, ''); // remove hyphens at the beginning and the end
    if (typeof style[property] == "string" || typeof style[property] == "number") element.style[cssProp] = style[property];
    else if (typeof style[property] == "function") createEffect(() => element.style[cssProp] = style[property]());
    else logger.log(style[property]);
  }
  return res;
}

/**
 * Registers an event listener of type `event` to `element`
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} callback
 */
function registerElementEventListener(element, event, callback) {
  element.addEventListener(event, (e) => callback(e));
}

/** @param {HTMLElement} parent */
function insertDynamic(parent, dynamic) {
  let current = null;
  createEffect(() => {
    let child = dynamic();
    if (child == null || child == undefined) child = createPositionElement();
    current = handleChild(parent, child, current);
  });
  return parent;
}

/** @param {HTMLElement} parent */
function insertFragment(parent, fragment) {
  if (!Array.isArray(fragment)) return;
  fragment.forEach(child => {
    handleChild(parent, child);
  });
  return parent;
}

/** @param {HTMLElement} parent */
function handleChild(parent, child, current) {
  if (child == null || child == null) return;
  const t = typeof child;
  // Fragments and components
  if (Array.isArray(child)) return insertFragment(parent, child);
  else if (t == "function") return insertDynamic(parent, child);
  else if (child instanceof Node) {
    if (current && current instanceof Node) {
      parent.replaceChild(child, current);
      return child;
    }
    else return parent.appendChild(child);
  } else if (child == undefined) parent.removeChild(current);
  // Values
  if (t == "string") {
    if (current && current instanceof Node) {
      const val = document.createTextNode(child)
      parent.replaceChild(val, current);
      return val;
    }
    else return parent.appendChild(document.createTextNode(child));
  } else if (t == "number" || (t == "boolean" && t != false) || child instanceof Date || child instanceof RegExp) {
    if (current && current instanceof Node) {
      const val = document.createTextNode(child.toString());
      parent.replaceChild(val, current);
      return val;
    }
    else return parent.appendChild(document.createTextNode(child.toString()));
  } else if (t == "object") {
    // Handle this?
  }
}

function createPositionElement() {
  const pos = document.createElement("pos");
  return pos;
}

/*
for (let i = 0; i < children.length; i++) {
  let child = children[i];
  if (!isFragment && child != null) {
    if (typeof child == "function") {
      let lastChild;
      createEffect(() => {
        // TODO: Add support for fragments as childs
        if (lastChild) element.removeChild(lastChild);
        let newChild = child()
        console.log(child, newChild);
        if (newChild == null || newChild == undefined) return lastChild = null;
        newChild = newChild?.nodeType == null ? document.createTextNode(child().toString()) : child()
        element.appendChild(newChild);
        lastChild = newChild
      });
    }
    else element.appendChild(child?.nodeType == null ? document.createTextNode(child.toString()) : child)
  }
}
*/