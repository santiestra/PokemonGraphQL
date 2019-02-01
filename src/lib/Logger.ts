import * as bunyan from "bunyan";
import { Service } from "typedi";
import config from "../config";

enum LogType {
  info = "info",
  error = "error",
  warn = "warn",
}

@Service()
export default class Logger {
  private loggerClient: any;

  constructor() {
    this.loggerClient = bunyan.createLogger({ name: "Test Graph QL TS ORM" });
  }

  public info(message: string): void {
    this.log(message, LogType.info);
  }

  public error(message: string): void {
    this.log(message, LogType.error);
  }

  public warn(message: string): void {
    this.log(message, LogType.warn);
  }

  private log(message: string, type: LogType): void {
    if (this.shouldLog()) {
      this.loggerClient[type](message);
    }
  }

  private shouldLog(): boolean {
    return config.NODE_ENV !== "test";
  }
}
