// TODO: Add support for multiple touches

/**
 * @type {import("../types/index.d.ts").createGesture}
 */
export function createGesture(options) {
  options.distance ??= 10;
  options.autoStart ??= false;
  if (!options.target) return;  // error?

  /** @type {import("../types/index.d.ts").GestureData} */
  let data = null;
  let started = false,
    onstart = (e) => handleStart(options, e, data),
    onmove = (e) => {
      if (!data.manuallyEnded) handleMove(options, e, data);
    },
    onend = (e) => handleEnd(options, e, data);

  data = {
    start: { x: null, y: null },
    velocity: { x: null, y: null },
    current: { x: null, y: null },
    delta: { x: null, y: null },
    direction: null,
    hasMovedDistance: false,

    end() {
      data.manuallyEnded = true;
      onend();
    },
    manuallyEnded: false,
  }

  const start = () => {
    if (started == true) return;

    document.addEventListener("touchstart", onstart);
    document.addEventListener("touchmove", onmove);
    document.addEventListener("touchend", onend);
    started = true;
  }

  const stop = () => {
    if (started == false) return;

    document.removeEventListener("touchstart", onstart);
    document.removeEventListener("touchmove", onmove);
    document.removeEventListener("touchend", onend);
    started = false;
  }

  if (options.autoStart == true) start();

  return {
    start,
    stop
  }
}

/**
 * @param {import("../types/index.d.ts").GestureOptions} options 
 * @param {TouchEvent} event 
 * @param {import("../types/index.d.ts").GestureData} data 
 */
function handleStart(options, event, data) {
  data.manuallyEnded = false;
  data.start.x = data.current.x = event.touches[0].clientX;
  data.start.y = data.current.y = event.touches[0].clientY;

  if (typeof options.onStart == "function") options.onStart(data);
}

/**
 * @param {import("../types/index.d.ts").GestureOptions} options 
 * @param {TouchEvent} event 
 * @param {import("../types/index.d.ts").GestureData} data 
 */
function handleMove(options, event, data) {
  data.delta.x = event.touches[0].clientX - data.start.x;
  data.delta.y = event.touches[0].clientY - data.start.y;
  // Check if moved required distance and set distance if true
  if (data.hasMovedDistance == false && (Math.abs(data.delta.x) > options.distance || Math.abs(data.delta.y) > options.distance)) {
    data.hasMovedDistance = true;

    if (Math.abs(data.delta.x) > Math.abs(data.delta.y)) data.direction = "horizontal";
    else data.direction = "vertical";
  }
  else if (data.hasMovedDistance == false) return;

  data.velocity.x = event.touches[0].clientX - data.current.x;
  data.velocity.y = event.touches[0].clientY - data.current.y;
  data.current.x = event.touches[0].clientX;
  data.current.y = event.touches[0].clientY;

  if (typeof options.onMove == "function") options.onMove(data);
}

/**
 * @param {import("../types/index.d.ts").GestureOptions} options 
 * @param {TouchEvent} event 
 * @param {import("../types/index.d.ts").GestureData} data 
 */
function handleEnd(options, event, data) {
  // Make deep copy to avoid data changing
  if (typeof options.onEnd == "function" && data.manuallyEnded == false) options.onEnd(JSON.parse(JSON.stringify(data)));

  data.start = { x: null, y: null }
  data.velocity = { x: null, y: null }
  data.current = { x: null, y: null }
  data.delta = { x: null, y: null }
  data.hasMovedDistance = false;
  data.direction = null;
}