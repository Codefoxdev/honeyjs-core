import { render } from "./render.js";
import { createNamespace } from "./events.js";
import { getRoute } from "./router.js";
import { injectCSS } from "./styles.js";

/** @type {HTMLElement | null} */
export let AppRoot = null;
/** @type {Ceramic.AppOptions | null} */
let AppOptions = null;
let AppStarted = false;

/**
 * @param {Ceramic.AppOptions} options
 */
export function CeramicApp(options) {
  const events = createNamespace("app");
  AppRoot = options.root;
  AppOptions = options;

  return {
    /**
     * Responsible for rendering the page at the initial page load
     */
    render: () => {
      if (AppRoot == null) return console.error("Please specify an app root to render the pages");
      const route = getRoute();
      injectCSS(AppRoot);
      render(route, null);
      if (!AppStarted) {
        AppStarted = true;
        events.emit("load");
      }
    },
    /**
     * @param {Ceramic.event} event 
     * @param {(e: object) => void} callback 
     */
    on: (event, callback) => events.listen(event, callback),
    events,
  }
}

/*
const bounding = child.getBoundingClientRect();
child.setAttribute("transition", "out");

child.style.top = `${bounding.top}px`;
child.style.left = `${bounding.left}px`;
setTimeout(() => {
  child.style.position = "absolute";
}, 0);

child.animate(
  [
    { transform: "translate(0px)" },
    { transform: "translate(110vw)" }
  ],
  {
    duration: AppOptions.config.transition.duration,
    easing: "ease"
  }
)

setTimeout(() => {
  AppRoot.removeChild(child);
}, AppOptions.config.transition.duration);
*/

/*
const bounding = child.getBoundingClientRect();
child.setAttribute("transition", "in");

child.style.top = `${bounding.top}px`;
child.style.left = `${bounding.left}px`;
setTimeout(() => {
  child.style.position = "absolute";
}, 0);

child.animate(
  [
    { transform: "translate(-110vw)" },
    { transform: "translate(0px)" }
  ],
  {
    duration: AppOptions.config.transition.duration,
    easing: "ease"
  }
)

setTimeout(() => {
  child.style.position = "";
  child.removeAttribute("transition");
}, AppOptions.config.transition.duration);
*/

/**
 * Registers an event listener of type `event` to `element`
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} callback
 */
//export function registerElementEventListener(element, event, callback) {
//  element.addEventListener(event, (e) => callback(e));
//}