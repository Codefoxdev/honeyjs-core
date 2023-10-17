import { Plugin } from "vite";

declare interface options {
  /**
   * Defines whether to add an hmr accept to the module, this is because proper hmr isn't implemented yet
   * @default true
   */
  addHMRAccept: boolean;
  transformCached: boolean;
}

export default function (options?: options): Plugin;
