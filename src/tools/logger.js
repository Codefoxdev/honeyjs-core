const globalPrefix = "ceramic";

export class Logger {
  constructor(alias) {
    this.alias = alias;
  }
  log(...data) {
    console.log(`[${globalPrefix}] [${this.alias}]`, ...data);
  }
  warn(...data) {
    console.warn(`[${globalPrefix}] [${this.alias}]`, ...data);
  }
  error(...data) {
    console.error(`[${globalPrefix}] [${this.alias}]`, ...data);
  }
  throwError(...data) {

  }
}