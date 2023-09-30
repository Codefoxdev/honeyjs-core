import { createNamespace } from "./events.js";
import { getRoute } from "./router.js";

/** @type {HTMLElement | null} */
let AppRoot = null;
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

/**
 * @param {Ceramic.route} route 
 * @param {Ceramic.route} previousRoute 
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

  // Remove items or add transition
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

function _closest(arr, closestTo) {
  var closest = Math.max.apply(null, arr);
  for (var i = 0; i < arr.length; i++)
    if (arr[i] >= closestTo && arr[i] < closest) closest = arr[i];

  return closest;
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