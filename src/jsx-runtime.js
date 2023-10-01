import { createEffect } from "./app/reactivity.js";

const parseAttributes = ["key", "ref", "preserve"];
const skipAttributes = ["children"];

/* {
  tag: "p",
  attrs: {},
  children: []
} */

export function h(tag, attrs, ...children) {
  const isFragment = tag.isFragment == true;
  const isCustom = (typeof tag == "function") && !isFragment;
  const isElement = !isFragment && !isCustom;

  let element = null;
  attrs ??= {};
  attrs.children = children;

  if (isElement) element = document.createElement(tag);
  else if (isCustom) element = tag(attrs);
  else if (isFragment) element = tag(attrs);
  else console.error("Something went wrong while parsing the tag information");

  if (!isFragment) {
    for (let name in attrs) {
      if (name && attrs.hasOwnProperty(name)) {
        const value = attrs[name];

        // Check if it should be parsed
        if (skipAttributes.includes(name) || (isCustom && !parseAttributes.includes(name) && !isEvent(name))) continue;

        // Parse attributes correctly
        if (name == "style" && typeof value == "object") element.setAttribute(name, parseStyles(value));
        else if (isEvent(name) && !isFragment) registerElementEventListener(element, name.toLowerCase().replace("on", ""), value);
        else element.setAttribute(parseProperty(name), (value === true) ? value : value.toString());
      }
    }
  }

  if (!isCustom) {
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      if (!isFragment) {
        if (typeof child == "function") {
          let lastChild;
          createEffect(() => {
            if (lastChild) element.removeChild(lastChild);
            let newChild = child()?.nodeType == null ? document.createTextNode(child().toString()) : child()
            element.appendChild(newChild);
            lastChild = newChild
          });
        }
        else element.appendChild(child?.nodeType == null ? document.createTextNode(child.toString()) : child);

      }
    }
  }

  return element;
}

/** @param {object} attrs */
export const Fragment = (attrs) => {
  attrs.isFragment = true;
  return attrs;
}
Fragment.isFragment = true;

/* function parseAttributes(attrs, isCustom = false) {
  if (!attrs) return null;
  let res = {};

  for (let name in attrs) {
    const value = () => attrs[name];

    if (skipCustom.includes(name) || (isCustom && !parseCustom.includes(name) && !isEvent(name))) continue;
    if (name == "style" && typeof value() == "object") res[name] = parseStyles(value());
    else if (isEvent(name)) res[name.toLowerCase()] = value();
    else res[parseProperty(name)] = (value() === true) ? value() : value().toString();
  }
  return res;
} */

/** @param {string} property */
function isEvent(property) {
  return property.toLowerCase().startsWith("on");
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

function parseProperty(property) {
  if (property.toLowerCase() == "classname") return "class";
  return property;
}

/**
 * Registers an event listener of type `event` to `element`
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} callback
 */
export function registerElementEventListener(element, event, callback) {
  element.addEventListener(event, (e) => callback(e));
}

/*
const isFragment = tag.isFragment == true;
const isCustom = (typeof tag == "function") && !isFragment;
const isElement = !isFragment && !isCustom;

let element = null;
attrs ??= {};
attrs.children = children;

if (isElement) element = document.createElement(tag);
else if (isCustom) element = tag(attrs);
else if (isFragment) element = tag(attrs);
else console.error("Something went wrong while parsing the tag information");

if (!isFragment) {
  for (let name in attrs) {
    if (name && attrs.hasOwnProperty(name)) {
      const value = attrs[name];

      // Check if it should be parsed
      if (skipAttributes.includes(name) || (isCustom && !parseAttributes.includes(name) && !isEvent(name))) continue;

      // Parse attributes correctly
      if (name == "style" && typeof value == "object") element.setAttribute(name, parseStyles(value));
      else if (isEvent(name) && !isFragment) registerElementEventListener(element, name.toLowerCase().replace("on", ""), value);
      else element.setAttribute(parseProperty(name), (value === true) ? value : value.toString());
    }
  }
}

if (!isCustom) {
  for (let i = 2; i < arguments.length; i++) {
    let child = arguments[i];
    if (!isFragment) {
      element.appendChild(child?.nodeType == null ? document.createTextNode(child.toString()) : child);
      createEffect(() => console.log(child));
    }
  }
}

return element;
*/