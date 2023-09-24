/**
 * @typedef {{
 *  root: HTMLElement,
 *  autoHideSplashScreen: boolean,
 *  preset: "topbar" | "tabs" | "tabs-and-topbar" | "custom" | null
 * }} AppOptions
 * 
 * @typedef {{
 *  body: Function,
 *  topbar: Function | null,
 *  tabs: Function | null
 * }} PageOptions
 */

import { routes, getLocation } from "./router.js";

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
      render(route);
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

let previousRoute = null;

export function render(route) {
  let [ nav, main ] = [ AppRoot.querySelector("nav"), AppRoot.querySelector("main") ];
  const { navbar, body } = route.page;

  if (!nav && navbar) AppRoot.insertBefore(nav = document.createElement("nav"), AppRoot.firstChild);
  else if (nav && !navbar) AppRoot.removeChild(nav);
  if (!main && body) AppRoot.append(main = document.createElement("main"));
  else if (main && !body) AppRoot.removeChild(main);

  if (!previousRoute || (navbar && !navbar.isEqualNode(previousRoute.page.navbar))) {
    nav.innerHTML = "";
    nav.append(navbar.cloneNode(true));
  }
  main.innerHTML = "";
  main.append(body.cloneNode(true));

  previousRoute = route;
}

/**
 * @param {PageOptions} options
 */
export function CeramicPage(options) {
  return options;
}