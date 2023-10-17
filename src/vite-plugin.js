const REGEX = {
  extension: /\.(tsx|ts|jsx|js)$/,
  onEvent: /on([a-zA-Z0-9_]*)\={(.*)}/gm
}

/**
 * @param {object} options
 * @param {boolean} options.addHMRAccept
 * @param {boolean} options.transformCached Set this to true if you're experiencing issues regarding vite's cache
 */
export default function (options = {}) {
  let parsed = [];
  let HMRAcceptFile = null;

  return {
    name: "@honeyjs/core",
    enforce: "pre",

    config: () => ({
      esbuild: {
        jsxInject: `import { h, Fragment } from "@honeyjs/core/jsx-runtime";`,
        jsxFactory: "h",
        jsxFragment: `Fragment`,
      },
    }),

    /**
     * @param {import("vite").HmrContext} ctx 
     */
    handleHotUpdate(ctx) {

    },
    async ShouldTransformCachedModuleHook() { return options.transformCached == true; },
    async transform(src, id) {
      if (!id.match(REGEX.extension)) return;

      // Add HMRAccept to entry point if `options.addHMRAccept` == true
      if (options.addHMRAccept == true && (!HMRAcceptFile || id == HMRAcceptFile)) {
        HMRAcceptFile = id;
        src += `
// Code injected by @honeyjs/core
if (import.meta.hot) {
  import.meta.hot.accept();
}`;
      }

      return {
        code: src,
        map: null
      }
    }
  }
}