let _ids = [];
let _registered = [];

/**
 * Registers an event listener with `callback` which gets called when `event` is called on the element with the returned id
 * @param {string} event 
 * @param {Function} callback 
 */
export function registerEventListener(event, callback) {
  if (event.startsWith("on")) event = event.replace("on", "");
  const _id = generateEventId(event);

  registerDomEventListener(event, _id, callback);
  return _id
}

function generateEventId(event) {
  const _id = `ceramic_data_${Math.random().toString(16).slice(2)}_${event}`;
  if (_ids.indexOf(_id) != -1) return generateEventId(event);
  return _id;
}

function registerDomEventListener(event, id, callback) {
  let i = _registered.findIndex(e => e.event == event);
  if(i == -1) {
    _registered.push({ event, listeners: [] })
    i = _registered.findIndex(e => e.event == event);

    document.addEventListener("click", (e) => {
      if (!e || !e.target) return;
      const _ele = e.target;
      const listeners = _registered.find(e => e.event == event)?.listeners;
      if (!listeners) return;
      const listener = listeners.find(e => e.id == _ele.id);
      if (!listener) return;
      listener.callback(e);
    })
  }
  _ids.push(id);
  _registered[i].listeners.push({ id, callback });
}

window.invokeCeramicEvent = (event) => {
  return `hi_${event}`;
}