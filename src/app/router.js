import { render } from "./render.js";
import { h } from "../jsx-runtime.js";

// TOOLS
import { Logger } from "../tools/logger.js";
import { createNamespace, listen as events_listen } from "../tools/events.js";

const logger = new Logger("router");
const events = createNamespace("router");

export let routes = [];
let currentRoute = null;

// TODO: Route validation
// TODO: Wildcard support

/**
 * @param {Array<Honey.route>} routesConfig
 */
export function defineRoutes(routesConfig) {
  routes = routesConfig;
  return routes;
}

/**
 * Gets the corresponding route at the specified path
 * @param {string} targetPath The location in pathname format `/path/to/page` or leave empty for current location
 */
export function getRoute(targetPath) {
  targetPath ??= getLocation();
  return routes.find(e => e.route == targetPath);
}

/**
 * @param {object} param0 
 * @param {string} param0.href The location in pathname format `/path/to/page`
 */
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

/**
 * Gets the current location (non reactive)
 * @returns {string} The location in pathname format `/path/to/page`
 */
export const getLocation = () => historyList[historyIndex];

/**
 * Navigates back one page into history
 */
export function back() {
  historyIndex = Math.max(0, historyIndex - 1);
  const res = events.emit("back", {
    current: getLocation(),
    target: historyList[historyIndex],
    history: historyList
  }, true);
  if (res != false) _render(historyIndex);
}

/**
 * Navigates forward one page (if possible) in history
 */
export function forward() {
  historyIndex = Math.min(historyList.length - 1, historyIndex - 1);
  const res = events.emit("forward", {
    current: getLocation(),
    target: historyList[historyIndex],
    history: historyList
  }, true);
  if (res != false) _render(historyIndex);
}

/**
 * Navigates to the provided `targetPath`
 * @param {string} targetPath The location in pathname format `/path/to/page`
 */
export function navigate(targetPath) {
  if (targetPath == getLocation()) return;
  if (historyIndex < historyList.length - 1) {
    historyList.length = historyIndex + 1;
  }
  const res = events.emit("navigate", {
    current: getLocation(),
    target: targetPath,
    history: historyList
  }, true);

  if (res != false) {
    historyList.push(targetPath);
    historyIndex = historyList.length - 1;
    _render(historyIndex);
  };
}

// HELPER FUNCTIONS

function _render(index) {
  if (!historyList[index]) return false;
  const newRoute = routes.find(e => e.route == historyList[index]);

  render(
    newRoute,
    currentRoute
  );
  history.pushState({}, "", historyList[index]);
  currentRoute = newRoute;
}