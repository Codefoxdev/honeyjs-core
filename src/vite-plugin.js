const REGEX = {
  extension: /\.(tsx|ts|jsx|js)$/,
  onEvent: /on([a-zA-Z0-9_]*)\={(.*)}/gm
}

/**
 * @param {object} options
 * @param {boolean | null} options.addHMRAccept
 * @returns 
 */
export default function (options = {}) {
  let parsed = [];
  let HMRAcceptFile = null;

  return {
    name: "vite-plugin-honeyjs",
    enforce: "pre",

    config: () => ({
      esbuild: {
        jsxInject: `import { h, Fragment } from "@honeyjs/core/jsx-runtime";`,
        jsxFactory: "h",
        jsxFragment: `Fragment`,
      },
    }),
    async ShouldTransformCachedModuleHook() { return true; },
    async transform(src, id) {
      if (!id.match(REGEX.extension)) return;

      // Transform if it is jsx/tsx
      // if (id.match(/\.(tsx|jsx)$/)) src = transformJSX(src, id);

      // Add HMRAccept to entry point if `options.addHMRAccept` == true
      if (options.addHMRAccept == true && (!HMRAcceptFile || id == HMRAcceptFile)) {
        HMRAcceptFile = id;
        src += `\nif (import.meta.hot) { import.meta.hot.accept() } \n// HMRAcceptFile: ${HMRAcceptFile}`;
      }

      return {
        code: src,
        map: null
      }
    }
  }
}