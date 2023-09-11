const REGEX = {
  extension: /\.(jsx|tsx)$/,
  onEvent: /on([a-zA-Z0-9_]*)\={([a-zA-Z0-9_\(\)\=\>]*)}/gm
}

export default function(options = {}) {
  let parsed = [];

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
    async transform (src, id) {
      if (!id.match(REGEX.extension) || parsed.includes(id)) return;
      parsed.push(id);

      const transformed = transformJSX(src, id);
      return {
        code: transformed,
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
  let matches = [ ...src.matchAll(REGEX.onEvent) ];

  for (const match of matches) {
    const varName = `__key_${match[1]}_${Math.random().toString(16).slice(2)}`;
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