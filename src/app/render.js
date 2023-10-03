import { AppRoot } from "./app.js";

/**
 * @param {Ceramic.route} route 
 * @param {Ceramic.route} previousRoute 
 */
export function render(route, previousRoute) {
  const routeComponent = route.component;
  const children = Array.from(AppRoot.children);
  if (children.length == 0 && !routeComponent.isFragment) {
    if (routeComponent instanceof HTMLElement) return AppRoot.append(routeComponent);
    else if (Array.isArray(routeComponent)) routeComponent.forEach(e => AppRoot.append(e));
  }
  // Get preserve items
  let skip = [];
  /** @type {Array} */
  let newChildren = null;
  if (routeComponent instanceof HTMLElement) newChildren = [routeComponent];
  else if (Array.isArray(routeComponent)) newChildren = routeComponent;

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

  const oldWrapper = document.createElement("div");
  oldWrapper.setAttribute("wrapper", "transition");
  oldWrapper.setAttribute("transition", "out");
  AppRoot.append(oldWrapper);

  // Remove items or add transition
  for (const child of children) {
    const isPreserve = skip.find(e => e.element.isEqualNode(child));
    if (isPreserve) continue;

    //AppRoot.removeChild(child);
    oldWrapper.appendChild(child);
  }

  oldWrapper.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease", fill: "forwards" });

  setTimeout(() => {
    AppRoot.removeChild(oldWrapper);
  }, 200);

  const newWrapper = document.createElement("div");
  newWrapper.setAttribute("wrapper", "transition");
  newWrapper.setAttribute("transition", "in");
  AppRoot.append(newWrapper);

  // Add new items    - create
  newChildren.forEach((child, index) => {
    const isPreserve = skip.find(e => e.element.isEqualNode(child));
    if (isPreserve) return;
    newWrapper.appendChild(child);
  });

  newWrapper.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease", fill: "forwards" });

  // Add new items    - To body change after transitin
  let indices = skip.map(e => e.index);
  setTimeout(() => {
    newChildren.forEach((child, index) => {
      const isPreserve = skip.find(e => e.element.isEqualNode(child));
      const nextIndex = _closest(indices, index);
      const nextItem = skip.find(e => e.index == nextIndex)?.element;
      if (isPreserve) return;
      if (nextIndex < index) return AppRoot.appendChild(child);
      AppRoot.insertBefore(child, nextItem);
    });
    AppRoot.removeChild(newWrapper);
  }, 200);
}

// TODO: Add event listeren class to drop eventlisteners when they are out of scope

/**
 * Registers an event listener of type `event` to `element`
 * @param {HTMLElement} element
 * @param {string} event
 * @param {Function} callback
 */
function registerElementEventListener(element, event, callback) {
  element.addEventListener(event, (e) => callback(e));
}

function _closest(arr, closestTo) {
  var closest = Math.max.apply(null, arr);
  for (var i = 0; i < arr.length; i++)
    if (arr[i] >= closestTo && arr[i] < closest) closest = arr[i];

  return closest;
}