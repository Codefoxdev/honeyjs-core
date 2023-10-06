import { Logger } from "../tools/logger.js";

const presetData = {
  transform: {
    keyframes: {
      previous: [
        { transform: "translate(0px)" },
        { transform: "translate(110vw)" }
      ],
      next: [
        { transform: "translate(-110vw)" },
        { transform: "translate(0px)" }
      ]
    }
  },
  fade: {
    keyframes: {
      previous: [
        { opacity: "1" },
        { opacity: "0" }
      ],
      next: [
        { opacity: "0" },
        { opacity: "1" }
      ]
    }
  },
}

const logger = new Logger("transitions");

const defaults = {
  delay: 0,
  direction: "normal",
  duration: 1000,
  easing: "linear",
  fill: "none",
  iterations: 1
}

export class Transition {
  /**
   * @param {Ceramic.transition.handler | Ceramic.transition.keyframes} keyframes
   * @param {Ceramic.transition.options} options
   */
  constructor(keyframes, options) {
    this.options = {}
    options ??= {}

    if (isPreset(keyframes)) this.keyframes = this.loadPreset(keyframes);
    else this.keyframes = keyframes;

    for (const prop in defaults) this.options[prop] = options[prop] ?? defaults[prop];
  }
  loadPreset(preset) {
    return isPreset(preset);
  }
}

// TODO: Add support for custom presets
function isPreset(preset) {
  if (typeof preset == "function") return false;
  const data = presetData[preset].keyframes;
  if (data) return data;
  logger.warn(`Preset: ${preset}, not found falling back to the 'fade' preset`);
  return presetData.fade.keyframes;
}