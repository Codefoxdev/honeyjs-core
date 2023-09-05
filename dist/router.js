// Get current route
// Change route
// Define transition

import { render } from "./page.js";
import { h } from "./jsx-parser.js";

export let routes = [];

/**
 * 
 * @param {Array<{ name: string, url: string, page: Function }>} routesConfig 
 */
export function defineRoutes(routesConfig) {
  routes = routesConfig;
  // TODO: Route validation
}

let _silentAnchors = [];

document.addEventListener("click", (e) => {
  let element = e.target;
  if (_silentAnchors.indexOf(element.id) == -1) return;
  e.preventDefault();
  navigate(element.pathname);
});

export function A({ href, children }) {
  const id = generateStringID(_silentAnchors);
  _silentAnchors.push(id);

  return h("a", { id: id, href: href }, children);
}

let location = window.location.pathname;

export const getLocation = () => location;

export function navigate(targetPath) {
  console.log(`Navigating: ${targetPath}`);

  render(routes.find(e => e.route == targetPath));
  history.pushState({}, "", targetPath)
}

function generateStringID(arr) {
  if (!Array.isArray(arr)) arr = [];
  const rng = `a_${Math.random().toString(16).slice(2)}`;
  if (arr.indexOf(rng) != -1) return generateStringID();
  return rng;
}