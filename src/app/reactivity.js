// This is our work in progress Reactive Library
const context = [];

function subscribe(running, subscriptions) {
  subscriptions.add(running);
  running.dependencies.add(subscriptions);
}

/**
 * @type {import("../types/index.d.ts").createSignal}
 */
export function createSignal(value) {
  const subscriptions = new Set();

  const read = () => {
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };

  const write = (nextValue) => {
    value = nextValue;

    for (const sub of [...subscriptions]) {
      sub.execute();
    }

    return value;
  };
  return [read, write];
}

function cleanup(running) {
  for (const dep of running.dependencies) {
    dep.delete(running);
  }
  running.dependencies.clear();
}

/**
 * @type {import("../types/index.d.ts").createEffect}
 */
export function createEffect(fn) {
  const effect = {
    execute() {
      cleanup(effect);
      context.push(effect);
      try {
        fn();
      } finally {
        context.pop();
      }
    },
    dependencies: new Set()
  };

  effect.execute();
}

/**
 * @type {import("../types/index.d.ts").createMemo}
 */
export function createMemo(fn) {
  const [s, set] = createSignal();
  createEffect(() => set(fn()));
  return s;
}

/**
 * @type {import("../types/index.d.ts").createRef}
 */
export function createRef() {
  return createSignal(null);
}