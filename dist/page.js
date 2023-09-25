/**
 * @typedef {import("./index.js").AppOptions} AppOptions
 * @typedef {import("./index.js").PageOptions} PageOptions
 * @typedef {import("./index.js").route} route
 */

import { routes, getLocation } from "./router.js";
import { generateElementRef } from "./events.js";
import { Fragment, h } from "../jsx-runtime/index.js";

/** @type {HTMLElement | null} */
let AppRoot = null;
/** @type {AppOptions | null} */
let AppOptions = null;
let AppStarted = false;
let AppEventListeners = [];

/**
 * @param {AppOptions} options
 */
export function CeramicApp(options) {
  AppRoot = options.root;
  AppOptions = options;

  return {
    render: () => {
      if (AppRoot == null) return console.error("Please specify an app root to render the pages");
      const location = getLocation();
      const route = routes.find(e => e.route == location) // TODO: Add wildcard support
      render(route, null);
      if (AppStarted == false) {
        AppStarted = true;
        emit("appload");
      }
    },
    /**
     * @param { "urlchange" | "pageload" | "appload" } event 
     * @param { (e: object) => void } callback 
     */
    on: (event, callback) => {
      AppEventListeners.push({
        event: event,
        callback: callback
      });
    }
  }
}

// TODO: Add prevent default option
function emit(event, data) {
  const listeners = AppEventListeners.filter(e => e.event == event);
  listeners.forEach(e => e.callback(data));
}

/**
 * 
 * @param {route} route 
 * @param {route} previousRoute 
 */
export function render(route, previousRoute) {
  const children = Array.from(AppRoot.children);
  if (children.length == 0) return AppRoot.append(route.component);
  const newChildren = Array.from(route.component.children);
}

/**
 * @param {PageOptions} options
 */
export function CeramicPage(options) {
  const page = _buildPage(options);
  return page;
}

/**
 * @param {PageOptions} options
 */
function _buildPage(options) {
  let topbar = options.topbar;
  let tabbar = options.tabbar;
  let body = options.body;

  if (topbar == null) topbar = AppOptions.defaults.topbar;
  if (tabbar == null) tabbar = AppOptions.defaults.tabbar;

  let contents = [];
  if (topbar) contents.push(topbar);
  if (tabbar) contents.push(tabbar);
  if (body) contents.push(body);

  return h(Fragment, null, ...contents);
}