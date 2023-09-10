let customListeners = [];
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

export function generateElementId() {
  const key = `ceramic_data_${Math.random().toString(16).slice(2)}`;
  if (customKeys.indexOf(key) != -1) return generateElementId();
  return key;
}

function registerDomEventListener(event, key, callback) {
  const obj = { event, key, callback }
  customListeners.push(obj);
  customKeys.push(key);
  document.addEventListener(event, (e) => {
    if (e.target.getAttribute("key") != key) return;
    callback(e);
  }) 
}

window.invokeCeramicEvent = (event) => {
  return `hi_${event}`;
}