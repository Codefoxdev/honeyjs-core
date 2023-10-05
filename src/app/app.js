import { render } from "./render.js";
import { getRoute } from "./router.js";
import { injectCSS } from "./styles.js";

// TOOLS
import { Logger } from "../tools/logger.js";
import { createNamespace, listen as events_listen } from "../tools/events.js";

const logger = new Logger("app");
const events = createNamespace("app");

/** @type {HTMLElement | null} */
export let AppRoot = null;
/** @type {Ceramic.AppOptions | null} */
export let AppOptions = null;
let AppStarted = false;

/**
 * @param {Ceramic.AppOptions} options
 */
export function CeramicApp(options) {
  logger.log("initializing...");
  AppRoot = options.root;
  AppOptions = options;

  return {
    // METHODS
    /**
     * Responsible for rendering the page at the initial page load
     */
    render: () => {
      if (AppRoot == null && !tryDefaultRoot()) return logger.error("app root not specified");
      const route = getRoute();
      const res = events.emit("load", {}, true, false);
      if (res) {
        injectCSS(AppRoot);
        render(route, null);
        logger.log("app loaded successfully");
        if (!AppStarted) {
          AppStarted = true;
        }
      }
    },
    on: events_listen,

    // VALUES
    events,
    environment: import.meta.env.MODE ?? "production",
  }
}

function tryDefaultRoot() {
  const fallback = document.querySelector("#app");
  if (!fallback) return false;
  logger.warn("app root not speficied falling back to", fallback);
  AppRoot = AppOptions.root = fallback;
  return true;
}