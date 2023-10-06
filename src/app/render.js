import { AppRoot, AppOptions } from "./app.js";

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
    // Create filler element
    if (isPreserve) {
      oldWrapper.appendChild(createFiller(child));
      continue;
    }
    oldWrapper.appendChild(child);
  }

  const transition = AppOptions.config.transition;
  let keyframes = transition.keyframes;
  if (typeof keyframes == "function") keyframes = keyframes({ next: route.name, previous: previousRoute?.name });
  console.log(transition);
  oldWrapper.animate(keyframes.previous, transition.options);

  setTimeout(() => {
    AppRoot.removeChild(oldWrapper);
  }, transition.options.duration);

  const newWrapper = document.createElement("div");
  newWrapper.setAttribute("wrapper", "transition");
  newWrapper.setAttribute("transition", "in");
  AppRoot.append(newWrapper);

  // Add new items    - create
  newChildren.forEach((child, index) => {
    const isPreserve = skip.find(e => e.element.isEqualNode(child));
    if (isPreserve) return newWrapper.appendChild(createFiller(isPreserve.element));
    newWrapper.appendChild(child);
  });

  newWrapper.animate(keyframes.next, transition.options);

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
  }, transition.options.duration);
}

/**
 * @param {HTMLElement} element 
 * @returns {HTMLDivElement}
 */
function createFiller(element) {
  const filler = document.createElement("div");
  const size = element.getBoundingClientRect();
  filler.setAttribute("filler", "");
  filler.style.width = `${size.width}px`;
  filler.style.height = `${size.height}px`;
  return filler;
}

// TODO: Add event listener class to drop eventlisteners when they are out of scope

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