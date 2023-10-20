const globalPrefix = "honey";
const logVerbose = true;  // TODO: Add setting for this

export class Logger {
  constructor(alias) {
    this.alias = alias;
  }
  logVerbose(...data) {
    if (!logVerbose) return;
    //data = data.map(e => (typeof e == "string") ? [`%c ${e}`, "color: green"] : e);
    console.log(`[${globalPrefix}] [${this.alias}]`, ...(data.flat()));
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