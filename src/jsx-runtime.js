const parseAttributes = ["key", "ref", "preserve"];
const skipAttributes = ["children"];

export function h(tag, attrs, ...children) {
  const isFragment = tag.isFragment == true;
  const isCustom = (typeof tag == "function") && !isFragment;
  const isElement = !isFragment && !isCustom;

  /** @type { null | Function | HTMLElement } */
  let element = null;
  attrs ??= {};
  attrs.children = children;

  if (isElement) element = document.createElement(tag);
  else if (isCustom) element = tag(attrs);
  else if (isFragment) element = tag(attrs);
  else console.error("Something went wrond while parsing the tag information");

  if (!isFragment) {
    for (let name in attrs) {
      if (name && attrs.hasOwnProperty(name)) {
        const value = attrs[name];

        // Check if it should be parsed
        if (skipAttributes.includes(name) || (isCustom && !parseAttributes.includes(name) && !isEvent(name))) continue;

        // Parse attributes correctly
        if (name == "style" && typeof value == "object") element.setAttribute(name, parseStyles(value));
        else if (isEvent(name) && !isFragment) registerElementEventListener(element, name.replace("on", ""), value);
        else element.setAttribute(parseProperty(name), (value === true) ? value : value.toString());
      }
    }
  }

  if (!isCustom) {
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      if (!child) child = document.createTextNode(`${child}`);
      if (!isFragment) element.appendChild(child?.nodeType == null ? document.createTextNode(child.toString()) : child);
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

/** @param {string} property */
function isEvent(property) {
  return property.toLowerCase().startsWith("on");
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