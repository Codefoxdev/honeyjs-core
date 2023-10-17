import { createEffect } from "../app/reactivity.js";

/** @param {HTMLElement} element */
export function style(element, style) {
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