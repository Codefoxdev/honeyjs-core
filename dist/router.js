// Get current route
// Change route
// Define transition

import { render } from "./page.js";
import { registerEventListener } from "./events.js";
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

export function A({ href, children }) {
  const key = registerEventListener("click", (e) => {
    e.preventDefault();
    navigate(e.target.pathname);
  })

  return h("a", { key, href }, children);
}

// HISTORY

let historyList = [ window.location.pathname ];
let historyIndex = 0;

export const getLocation = () => historyList[historyIndex];

export function back() {
  historyIndex = Math.max(0, historyIndex - 1);
  _render(historyIndex);
}

export function forward() {
  historyIndex = Math.min(historyList.length - 1, historyIndex - 1);
  _render(historyIndex);
}

export function navigate(targetPath) {
  if (historyIndex < historyList.length - 1) {
    historyList.length = historyIndex + 1;
  }
  historyList.push(targetPath);
  historyIndex = historyList.length - 1;
  _render(historyIndex);
}

function _render(index) {
  if (!historyList[index]) return false;
  const item = historyList[index];

  render(routes.find(e => e.route == item));
  history.pushState({}, "", item);
  console.log(historyList);
}