import { AppRoot } from "./app.js";

/**
 * @param {Ceramic.route} route 
 * @param {Ceramic.route} previousRoute 
 */
export function render(route, previousRoute) {
  console.log(route.component);
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