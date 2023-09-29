/**
 *  @namespace Ceramic
 * 
 *  @typedef {{
 *    root: HTMLElement;
 *    preset: "mobile" | "web" | null;
 *    config: {
 *      appBar: HTMLElement | Function;
 *      appBarLinks: Array<string>;
 *    };
 *  }} Ceramic.AppOptions
 * 
 *  @typedef {{
 *    name: string; 
 *    route: string; 
 *    component: Function | HTMLElement;
 *  }} Ceramic.route
 * 
 *  @typedef {"appload" | "navigate" | "render"} Ceramic.event
 */

export { CeramicApp } from "./app/app.js";
export { createNamespace, emit, listen } from "./app/events.js";
export { defineRoutes, getLocation, navigate, A, back, forward } from "./app/router.js";