/**
 *  @module 'Ceramic'
 * 
 *  @typedef {{
 *    root: HTMLElement;
 *    preset: "mobile" | "web" | null;
 *    config: {
 *      appBar: HTMLElement | Function;
 *      appBarLinks: Array<string>;
 *      transition: Ceramic.transition
 *    };
 *  }} Ceramic.AppOptions
 * 
 *  @typedef {{
 *    name: string; 
 *    route: string; 
 *    component: Function | HTMLElement;
 *  }} Ceramic.route
 * 
 *  @typedef {"load" | "navigate" | "back" | "forward"} Ceramic.event.name
 * 
 *  @typedef {(e: {
 *    cancelable: boolean,
 *    preventDefault: () => void,
 *    defaultPrevented: boolean
 *  }) => false | any} Ceramic.event.callback
 * 
 *  @typedef {{
 *    keyframes: Ceramic.transition.keyframes | Ceramic.transition.handler,
 *    options: Ceramic.transition.options,
 *  }} Ceramic.transition
 * 
 *  @typedef {"fade" | "transform" | Ceramic.transition.keyframeData} Ceramic.transition.keyframes
 * 
 *  @typedef {{
 *     previous: Array<object>,
 *     next: Array<object>
 *  }} Ceramic.transition.keyframeData
 * 
 *  @typedef {{
 *    delay: number,
 *    direction: "normal" | "reverse" | "alternate" | "alternate-reverse"
 *    duration: number,
 *    easing: string,
 *    fill: "backwards" | "forwards" | "none",
 *    iterations: number
 *  }} Ceramic.transition.options
 * 
 *  @typedef {(data: {
 *    previous: string,
 *    next: string,
 *    defaultTransition: Ceramic.transition
 *  }) => Array} Ceramic.transition.handler
 */