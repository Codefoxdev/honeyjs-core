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
 *    duration: number,
 *    easing: string,
 *    preset: "fade" | "transform"
 *  }} Ceramic.transition
 */