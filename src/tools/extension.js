import { AppRoot } from "../app/app.js";
export class Extension {
  /**
   * @param {{
   *  package: string,
   *  alias: string
   * }} options
   */
  constructor(options) {
    this.options = options;

    this.root = AppRoot;
  }
  /**
   * @param {string | HTMLStyleElement} css 
   */
  injectCSS(css) {
    let ele;
    if (typeof css == "string") {
      ele = document.createElement("style");
      ele.setAttribute("package", this.options.package);
      ele.innerHTML = css;
    } else if (css instanceof HTMLStyleElement) ele = css;

    document.body.appendChild(ele);
  }
}