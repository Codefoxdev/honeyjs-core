declare interface AppOptions {
  /**
   * The root of the project in the index.html file,
   * defaults to a div with id of app.
   * Also gives a warning when it's not specified, or isn't found.
   * @default document.querySelector("#app")
   */
  root: HTMLElement;
  /**
   * The preset that the app should follow,
   * currently does nothing.
   */
  preset: "mobile" | "web";
}

declare interface App {
  /**
   * Should be called on the initial page load, and renders the app to the specified root.
   */
  render: (component: Component) => void;

  /**
   * Registers an event, that can be cancelled by returning false in a synchronous function or by calling `e.preventDefault()`
   * @param event The eventname to listen for, this can be a globale event e.g. `load` or it can listen to a specific namespace e.g. `router:navigate`
   * @param fn The callback that gets fired when an event is emitted
   */
  on: (event: string, fn: (e: EventData) => false | void) => void;

  /**
   * The current environment on vite, either `development` or `production`
   */
  environment: "development" | "production";
}

declare interface EventData {
  /**
   * Indicates whether an event can be cancelled using `event.preventDefault()`
   */
  cancelable: boolean;
  /**
   * Indicates whether or not an event has been cancelled using `event.preventDefault()`
   */
  defaultPrevented: boolean;
  /**
   * Cancels an event if `cancelable` is set to `true`
   */
  preventDefault: () => void;
}

/**
 * Initializes the app with the required options
 */
export function HoneyApp(options: AppOptions): App;

/**
 * Creates a signal with `value`
 * @param value The initial value that the signal has
 */
export function createSignal(
  value: any
): [get: () => any, set: (value: any) => any];

/**
 * Creates an effect that runs when an effect used in the effect function changes
 * @param fn The effect function itself
 */
export function createEffect(fn: Function): void;

/**
 * Creates a memoization function, this helps with performance as it caches previous results
 * @param fn The memo function
 */
export function createMemo(fn: Function): () => any;

/**
 * Creates a ref that returns to functions:
 * - get; returns the element on which the ref is attached, this value changes when onMount is called
 * - set; attach this to an element
 * This function is currently the same as creating an effect, but with an initial value of `null`
 */
export function createRef(): [
  get: () => HTMLElement,
  set: (e: HTMLElement) => HTMLElement
];

/**
 * Fires when the element are mounted; when the app is loaded.
 * Usefull for refs and creating one-time side effects
 */
export function onMount(fn: Function): void;

/**
 * Fires when the app is unloaded, usefull for cleaning up effect
 */
export function onCleanup(fn: Function): void;

declare interface GestureOptions {
  target: HTMLElement;
  distance: number;
  alias: string;
  direction: "horizontal" | "vertical" | "both" | undefined;
  autoStart: boolean;

  onStart: (e: GestureData) => void;
  onMove: (e: GestureData) => void;
  onEnd: (e: GestureData) => void;
}

declare interface GestureMethods {
  start: () => void;
  stop: () => void;
  destroy: () => void;
}

declare interface GestureData {
  start: { x: number; y: number };
  velocity: { x: number; y: number };
  current: { x: number; y: number };
  delta: { x: number; y: number };
  direction: "horizontal" | "vertical" | null;
  hasMovedDistance: boolean;

  end: () => void;
  manuallyEnded: boolean;
}

export function createGesture(options: GestureOptions): GestureMethods;

// External Types
export type Component = HTMLElement | Function;
export type Color = string;
