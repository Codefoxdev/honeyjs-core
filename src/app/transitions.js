const presetData = {
  transform: {
    keyframes: {
      previous: [
        { transform: "translate(-110vw)" },
        { transform: "translate(0px)" }
      ],
      next: [
        { transform: "translate(0px)" },
        { transform: "translate(110vw)" }
      ]
    }
  },
  fade: {
    keyframes: {
      previous: [
        { opacity: "0" },
        { opacity: "1" }
      ],
      next: [
        { opacity: "1" },
        { opacity: "0" }
      ]
    }
  },
}

export class Transition {
  /**
   * @param {Ceramic.transition} options 
   */
  constructor(options) {
    this.duration = options.duration;
    this.easing = options.easing;
    this.preset = options.preset;
  }
}