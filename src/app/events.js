/**
 *  @type {Array<{
 *    name: string,
 *    listeners: Array<{
 *      event: string,
 *      callbacks: Array<Function>
 *    }>
 *  }>}
 */
let namespaces = [];

//TODO: Add prevent default option to listen
export function createNamespace(name) {
  const obj = {
    name: name,
    listeners: []
  }
  namespaces.push(obj);
  const index = namespaces.indexOf(obj);

  return {
    emit: (eventKey, data = {}) => {
      const cbs = namespaces[index].listeners.find(e => e.event == eventKey)?.callbacks;
      if (!cbs) return;
      for (const cb of cbs) cb(data);
    },
    listen: (eventKey, callback) => {
      const exists = namespaces[index].listeners.find(e => e.event == eventKey);
      if (!exists) {
        namespaces[index].listeners.push({
          event: eventKey,
          callbacks: [callback]
        });
        return;
      }
      exists.callbacks.push(callback);
    }
  }
}

/**
 * @param {string} eventKey The event key in the form `namespace:event`
 * @param {any} data 
 */
export function emit(eventKey, data = {}) {
  const [namespace, event] = eventKey.split(":");
  if (!namespace || !event) return;

  const ns = namespaces.find(e => e.name == namespace);
  if (!ns) return;

  const cbs = ns.listeners.find(e => e.event == event).callbacks;

  for (const cb of cbs) cb(data);
}

/**
 * @param {string} eventKey The event key in the form `namespace:event`
 * @param {any} data 
 */
export function listen(eventKey, callback) {
  const [namespace, event] = eventKey.split(":");
  if (!namespace || !event) return;

  const ns = namespaces.find(e => e.name == namespace);
  if (!ns) return;

  const exists = ns.listeners.find(e => e.event == event);
  if (!exists) {
    ns.listeners.push({
      event: event,
      callbacks: [callback]
    })
    return;
  }

  exists.callbacks.push(callback);
}