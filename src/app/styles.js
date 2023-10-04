const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
[wrapper=transition] {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
[filler=""] {
  display: block;
}
`

export function injectCSS(AppRoot) {
  document.body.appendChild(globalStyle);
}