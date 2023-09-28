/**
 * @typedef {import("./index.js").route} route
 */

import { render } from "./page.js";
import { h } from "../jsx-runtime/index.js";

export let routes = [];
let currentRoute = null;

/**
 * 
 * @param {Array<route>} routesConfig 
 */
export function defineRoutes(routesConfig) {
  routes = routesConfig;
  // TODO: Route validation
}

export function A({ href, children }) {
  const onclick = (e) => {
    e.preventDefault();
    navigate(href);
  }
  return h("a", { href, onclick }, children);
}

// HISTORY

let historyList = [window.location.pathname];
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

  render(
    routes.find(e => e.route == item),
    currentRoute
  );
  history.pushState({}, "", item);
  currentRoute = item;
}