/**
 *  @type {Array<{
 *    name: string,
 *    listeners: Array<{
 *      event: string,
 *      callbacks: Array<Function>
 *    }>
 *  }>}
 */
let namespaces = [
  {
    name: "global",
    listeners: [],
  }
];

//TODO: Add prevent default option to listen callback data
export function createNamespace(name) {
  const obj = {
    name: name,
    listeners: []
  }
  namespaces.push(obj);
  const index = namespaces.indexOf(obj);

  return {
    emit: (eventKey, data = {}, emitGlobal, cancelable = true) => {
      if (eventKey.includes(":"))
        return emit(eventKey, data, emitGlobal, cancelable);
      else
        return emit(`${name}:${eventKey}`, data, emitGlobal, cancelable)
    },
    listen: (eventKey, callback) => {
      if (eventKey.includes(":"))
        return listen(eventKey, callback);
      else
        return listen(`${name}:${eventKey}`, callback);
    }
  }
}

/**
 * @param {string} eventKey The event key in the form `namespace:event`
 * @param {any} data 
 */
export function emit(eventKey, data = {}, emitGlobal = false, cancelable = true) {
  const [namespace, event] = eventKey.split(":");
  if (!namespace || !event) return;
  // Data and preventDefualt
  let prevented = false;
  data = createCallbackData(data, cancelable);

  // Find by namespaces
  const callbacks = namespaces
    .find(e => e.name == namespace)?.listeners
    ?.find(e => e.event == event)?.callbacks;

  if (callbacks) {
    for (const callback of callbacks) {
      const res = callback(data);
      if (res == false) prevented = true;
    }
  }

  if (emitGlobal) {
    namespaces[0].listeners
      .find(e => e.event == event)?.callbacks
      ?.map(e => {
        if (e(data) == false) prevented = true;
      });
  }

  if ((prevented == true || data.defaultPrevented == true) && cancelable == true) return false;
  return true;
}

/**
 * @param {Ceramic.event.name} eventKey The event key in the form `namespace:event` or if the namespace is missing in the global namespace
 * @param {Ceramic.event.callback} callback 
 */
export function listen(eventKey, callback) {
  if (!eventKey.includes(":") || eventKey.split(":")[0] == "global")
    return listenGlobal(eventKey, callback);

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

function listenGlobal(eventKey, callback) {
  const eventExists = namespaces[0].listeners.find(e => e.event == eventKey);
  if (eventExists) eventExists.callbacks.push(callback);
  else {
    namespaces[0].listeners.push({
      event: eventKey,
      callbacks: [callback]
    });
  }
}

function createCallbackData(data, cancelable) {
  if (typeof data != "object" || !data) data = {};
  data.cancelable = cancelable;
  data.defaultPrevented = false;
  data.preventDefault = () => {
    if (cancelable == true) data.defaultPrevented = true;
  };
  return data;
}