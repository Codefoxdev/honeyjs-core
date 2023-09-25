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
  if (exists) return exists;
  const ref = generateElementRef();
  const obj = { element, ref }
  references.push(obj);
  return ref;
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

function registerDomEventListener(event, key, callback) {
  const obj = { event, key, callback }
  listeners.push(obj);
  document.addEventListener(event, (e) => {
    if (e.target.getAttribute("key") != key) return;
    callback(e);
  })
}

window.invokeCeramicEvent = (event) => {
  return `hi_${event}`;
}