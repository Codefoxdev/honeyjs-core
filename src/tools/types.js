/**
 *  @module 'Honey'
 * 
 *  @typedef {{
 *    root: HTMLElement;
 *    preset: "mobile" | "web" | null;
 *    config: {
 *      appBar: HTMLElement | Function;
 *      appBarLinks: Array<string>;
 *      transition: Honey.transition
 *    };
 *  }} Honey.AppOptions
 * 
 *  @typedef {{
 *    name: string; 
 *    route: string; 
 *    component: Function | HTMLElement;
 *  }} Honey.route
 * 
 *  @typedef {"load" | "navigate" | "back" | "forward"} Honey.event.name
 * 
 *  @typedef {(e: {
 *    cancelable: boolean,
 *    preventDefault: () => void,
 *    defaultPrevented: boolean
 *  }) => false | any} Honey.event.callback
 * 
 *  @typedef {{
 *    keyframes: Honey.transition.keyframes | Honey.transition.handler,
 *    options: Honey.transition.options,
 *  }} Honey.transition
 * 
 *  @typedef {"fade" | "transform" | Honey.transition.keyframeData} Honey.transition.keyframes
 * 
 *  @typedef {{
 *     previous: Array<object>,
 *     next: Array<object>
 *  }} Honey.transition.keyframeData
 * 
 *  @typedef {{
 *    delay: number,
 *    direction: "normal" | "reverse" | "alternate" | "alternate-reverse"
 *    duration: number,
 *    easing: string,
 *    fill: "backwards" | "forwards" | "none",
 *    iterations: number
 *  }} Honey.transition.options
 * 
 *  @typedef {(data: {
 *    previous: string,
 *    next: string,
 *    defaultTransition: Honey.transition
 *  }) => Array} Honey.transition.handler
 */