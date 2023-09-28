let listeners = [];
let references = [];
let customKeys = [];

/**
 * Registers an event listener of type `event` to `element` 
 * @param {HTMLElement} element 
 * @param {string} event 
 * @param {Function} callback 
 */
export function registerElementEventListener(element, event, callback) {
  element.addEventListener(event, (e) => {
    e.preventDefault();
    console.log(element, event);
    callback(e)
  });
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