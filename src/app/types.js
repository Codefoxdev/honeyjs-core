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
 *  @typedef {"load" | "navigate" | "render"} Ceramic.event
 * 
 *  @typedef {{
 *    keyframes: Ceramic.transitions.keyframes,
 *    options: Ceramic.transitions.options,
 *  }} Ceramic.transition
 * 
 *  @typedef {"fade" | "transform" | Ceramic.transitions.keyframeData} Ceramic.transitions.keyframes
 * 
 *    @typedef {{
 *       previous: Array<object>,
 *       next: Array<object>
 *    }} Ceramic.transitions.keyframeData
 * 
 *  @typedef {{
 *    delay: number,
 *    direction: "normal" | "reverse" | "alternate" | "alternate-reverse"
 *    duration: number,
 *    easing: string,
 *    fill: "backwards" | "forwards" | "none",
 *    iterations: number
 *  }} Ceramic.transitions.options
 */