/// <reference types="dist/index.js" />

declare module 'ceramic-app' {
  interface CeramicAppOptions {
    root: HTMLElement,
    autoHideSplashScreen: boolean,
    routeTransition: transition
  }

  interface CeramicAppData {
    on: (event: string, callback: Function) => void,
    render: () => void
  }

  export function CeramicApp(options: CeramicAppOptions): CeramicAppData
}

declare module 'ceramic-app/transitions' {
  declare interface transitionOptions {
    duration: number,
    type: string
  }
  declare interface transition {

  }

  export function defineTransition(options: transitionOptions): transition
}