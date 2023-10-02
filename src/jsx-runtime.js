import { createEffect } from "./app/reactivity.js";

const parseCustom = ["key", "ref", "preserve"];
const skipCustom = ["children"];

/* {
  tag: "p",
  attrs: {},
  children: []
} */

export function h(tag, attrs, ...children) {
  const isFragment = tag.isFragment == true;
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
  else console.error("Something went wrong while parsing the tag information");

  if (!isFragment) parseAttributes(element, attrs, isCustom);

  if (!isCustom) {
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      if (!isFragment && child != null) {
        if (typeof child == "function") {
          let lastChild;
          createEffect(() => {
            console.log(lastChild)
            if (lastChild) element.removeChild(lastChild);
            let newChild = child()
            if (newChild == null || newChild == undefined) return lastChild = null;
            newChild = newChild?.nodeType == null ? document.createTextNode(child().toString()) : child()
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
  return attrs;
}
Fragment.isFragment = true;

/**
 * @param {HTMLElement} element 
 * @param {object} attrs 
 * @param {boolean} isCustom 
 */
function parseAttributes(element, attrs, isCustom = false) {
  if (!attrs) return null;
  let res = {};

  for (let name in attrs) {
    const value = attrs[name];

    if (skipCustom.includes(name) || (isCustom && !parseCustom.includes(name) && !event(name))) continue;
    if (name == "style" && typeof value == "object") parseStyles(element, value);
    else if (event(name)) registerElementEventListener(element, event(name), value);
    else element.setAttribute(parseProperty(name), value);
  }
  return res;
}

/** @param {string} property */
function event(property) {
  const event = property.toLowerCase();
  if (!event.startsWith("on")) return false;
  return event.replace("on", "");
}

/**
 * @param {HTMLElement} element 
 * @param {*} style 
 */
function parseStyles(element, style) {
  let res = {};
  for (const property in style) {
    let cssProp = property.replace(/[A-Z][a-z]*/g, str => '-' + str.toLowerCase() + '-')
      .replace('--', '-') // remove double hyphens
      .replace(/(^-)|(-$)/g, ''); // remove hyphens at the beginning and the end
    if (typeof style[property] == "string" || typeof style[property] == "number") element.style[cssProp] = style[property];
    else if (typeof style[property] == "function") createEffect(() => element.style[cssProp] = style[property]());
    else console.log(style[property]);
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
function registerElementEventListener(element, event, callback) {
  element.addEventListener(event, (e) => callback(e));
}

/*
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
*/

/*
export function h(tag, attrs, ...children) {
  const isFragment = tag.isFragment == true;
  const isCustom = (typeof tag == "function") && !isFragment;
  const isElement = !isFragment && !isCustom;

  let element = null;
  attrs ??= {};
  attrs.children = children;

  if (isElement) {
    element = {
      tag,
      attrs: parseAttributes(attrs, isCustom),
      children
    }
  }
  else if (isCustom || isFragment) {
    const ele = tag(attrs);

    if (ele.tag && ele.attrs) {
      // Custom element
      element = {
        tag: ele.tag,
        attrs: parseAttributes(ele.attrs, isCustom),
        children: ele.children
      }
    } else if (!ele.tag) {
      // Fragment
      element = ele.children ?? ele;
    } else {
      console.error("Something went wrong while parsing the tag information")
    }
  }
  else console.error("Something went wrong while parsing the tag information");

  return element;
}
*/