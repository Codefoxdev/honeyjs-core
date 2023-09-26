let listeners = [];
let references = [];
let customKeys = [];

/**
 * Registers an event listener with `callback` which gets called when `event` is called on the element with the returned id
 * @param {string} event 
 * @param {Function} callback 
 */
export function registerEventListener(event, callback) {
  if (event.startsWith("on")) event = event.replace("on", "");
  const key = generateElementId();

  registerDomEventListener(event, key, callback);
  return key;
}

/**
 * Registers a `ref` key for in the dom which helps keep track of which element is which function
 * @param {Function} element 
 */
export function registerElementReference(element) {
  const exists = references.find(e => e.element == element);
  if (exists) return exists.ref;
  const ref = generateElementRef();
  const obj = { element, ref }
  references.push(obj);
  return ref;
}

/**
 * @param {string} key 
 */
export function handleKeyEvent(e, key) {

}

export function generateElementRef() {
  const key = `ceramic_ref_${Math.random().toString(16).slice(2)}`;
  if (customKeys.indexOf(key) != -1) return generateElementId();
  customKeys.push(key);
  return key;
}

export function generateElementId() {
  const key = `ceramic_data_${Math.random().toString(16).slice(2)}`;
  if (customKeys.indexOf(key) != -1) return generateElementId();
  customKeys.push(key);
  return key;
}

/**
 * Registers a DOM event listener and activates it when the dom has fully loaded
 * @param {*} event 
 * @param {*} key 
 * @param {*} callback 
 */
function registerDomEventListener(event, key, callback) {
  const obj = { event, key, callback }
  listeners.push(obj);
  // FIXME: Only last element gets returned, so event doesn't get called on parent
  document.addEventListener(event, (e) => {
    console.log("clicked:", e.target);
    if (e.target.getAttribute("key") != key) return;
    callback(e);
  })
}

/* addEventListener("load", (e) => {
  listeners.forEach((item, index) => {
    const ele = document.querySelector(`[key="${item.key}"]`);
    console.log(ele);
    if (!ele) return;
    ele.addEventListener(ele.event, (e) => ele.callback(e));
  });
}); */

window.invokeEvent = (event) => {
  console.log(event)
}