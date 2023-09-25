/**
 * @typedef {{
*  root: HTMLElement,
*  preset: "mobile" | "web" | null,
* }} AppOptions
* 
* @typedef {{
*  body: Function,
*  topbar: Function | null,
*  tabbar: Function | null
* }} PageOptions
* 
* @typedef {{
*  name: string,
*  route: string,
*  component: Function | HTMLElement
* }} route
* 

 add event and eventcallback types
*/

export { CeramicApp, CeramicPage } from "./page.js";
export { defineRoutes, getLocation, navigate, A, back, forward } from "./router.js";