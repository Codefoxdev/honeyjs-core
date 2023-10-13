const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
pos,
[pos="__true"] {
  position: absolute;
  pointer-events: none;
}
`

export function injectCSS() {
  document.body.appendChild(globalStyle);
}