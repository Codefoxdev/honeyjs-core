/**
 * @typedef {import("./index.js").AppOptions} AppOptions
 * @typedef {import("./index.js").PageOptions} PageOptions
 * @typedef {import("./index.js").route} route
 */

import { routes, getLocation } from "./router.js";
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
  const routeComponent = route.component;
  const children = Array.from(AppRoot.children);
  if (children.length == 0 && !routeComponent.isFragment) {
    return AppRoot.append(routeComponent);
  }
  // Get preserve items
  let skip = [];
  const newChildren = Array.from(routeComponent.children);
  const preserveChildren = children.filter(e => e.getAttribute("preserve"));
  preserveChildren.forEach(e => {
    for (const ne of newChildren) {
      if (e.isEqualNode(ne)) {
        skip.push({
          element: e,
          index: newChildren.indexOf(ne)
        });
        break;
      }
    }
  });

  // Remove items
  for (const child of children) {
    const isPreserve = skip.find(e => e.element.isEqualNode(child));
    if (isPreserve) continue;
    AppRoot.removeChild(child);
  }

  // Add new items
  let indices = skip.map(e => e.index);
  newChildren.forEach((child, index) => {
    const isPreserve = skip.find(e => e.element.isEqualNode(child));
    const nextIndex = _closest(indices, index);
    const nextItem = skip.find(e => e.index == nextIndex)?.element;
    if (isPreserve) return;
    if (nextIndex < index) return AppRoot.appendChild(child);
    AppRoot.insertBefore(child, nextItem);
  });
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

function _closest(arr, closestTo) {

  var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.

  for (var i = 0; i < arr.length; i++) { //Loop the array
    if (arr[i] >= closestTo && arr[i] < closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
  }

  return closest; // return the value
}

function _parseFragment(fragment) {

}