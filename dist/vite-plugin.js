const REGEX = {
  extension: /\.(tsx|ts|jsx|js)$/,
  onEvent: /on([a-zA-Z0-9_]*)\={([a-zA-Z0-9_\(\)\=\>]*)}/gm
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
    name: "vite-plugin-ceramic",
    enforce: "pre",

    config: () => ({
      esbuild: {
        jsxInject: `import { h, Fragment } from "ceramic-app/jsx-runtime";`,
        jsxFactory: "h",
        jsxFragment: "Fragment",
      },
    }),
    async ShouldTransformCachedModuleHook() { return true; },
    async transform(src, id) {
      if (!id.match(REGEX.extension)) return;

      // Transform if it is jsx/tsx
      if (id.match(/\.(tsx|jsx)$/)) src = transformJSX(src, id);

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

/**
 * @param {string} src 
 * @param {string} id 
 */
function transformJSX(src, id) {
  let matches = [...src.matchAll(REGEX.onEvent)];

  for (const match of matches) {
    const varName = `__key_${match[1].toLowerCase()}_${Math.random().toString(16).slice(2)}`;
    const injections = [
      `import { registerEventListener as __key_registerEventListener } from "ceramic-app/events";`,
      `const ${varName} = __key_registerEventListener("${match[1].toLowerCase()}", ${match[2]});`,
      src.substring(0, match.index),
      `key={${varName}}`,
      src.substring(match.index + match[0].length, src.length)
    ]

    src = injections.join("");
  }

  return src;
}