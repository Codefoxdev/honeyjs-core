/// <reference path="../types/index.d.ts"/>
import { injectCSS } from "./styles.js";

// TOOLS
import { Logger } from "../tools/logger.js";
import { createNamespace, listen as events_listen } from "../tools/events.js";

const logger = new Logger("app");
const events = createNamespace("app");

/** @type {HTMLElement | null} */
export let AppRoot = null;
/** @type {Honey.AppOptions | null} */
export let AppOptions = null;
let AppStarted = false;

/**
 * @type {import("../types/index.d.ts").HoneyApp}
 */
export function HoneyApp(options) {
  logger.log("initializing...");
  AppRoot = options.root;
  AppOptions = options;

  if (AppStarted) {
    logger.warn("app re-initialized, app and global event listeners will be removed");
    events.removeListeners();
  }

  return {
    // METHODS
    /**
     * Responsible for rendering the page at the initial page load
     * @param {Function} component The component to render
     */
    render: (component) => {
      if (AppStarted) logger.warn("app already rendered, rerendering may not result in expected results");
      if (AppRoot == null && !tryDefaultRoot()) return logger.error("app root not specified");
      const res = events.emit("load", {}, true, false);
      if (res) {
        injectCSS();
        render(component);
        logger.log("app loaded successfully");
        if (!AppStarted) {
          AppStarted = true;
          events.emit("mount", {}, true, false);
        }
      }
    },
    on: events_listen,

    // VALUES
    events,
    environment: import.meta.env.MODE ?? "production",
  }
}

export function onMount(fn) {
  events.listen("mount", fn);
}

export function onCleanup(fn) {
  events.listen("cleanup", fn);
}

/**
 * @param {Function} component 
 */
function render(component) {
  const contents = component();
  AppRoot.innerHTML = "";

  if (Array.isArray(contents)) {
    contents.flat().forEach(child => {
      AppRoot.appendChild(child);
    })
  } else {
    AppRoot.appendChild(contents);
  }
}

function tryDefaultRoot() {
  const fallback = document.querySelector("#app");
  if (!fallback) return false;
  logger.warn("app root not speficied falling back to", fallback);
  AppRoot = AppOptions.root = fallback;
  return true;
}

/* export function handleHMR(data) {

} */