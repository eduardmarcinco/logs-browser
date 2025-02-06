import { LogLevel } from '../browserlogs';
import { captureMessage } from '../capture';
import { getOptions } from '../init';
import utils from '../utils';

declare module '../BrowserLogsMethods' {
  interface BrowserLogsMethods {
    log(message: any, level?: LogLevel): void;
    error(message: any, level?: LogLevel): void;
    warn(message: any, level?: LogLevel): void;
    debug(message: any, level?: LogLevel): void;
    info(message: any, level?: LogLevel): void;
  }
}

const log = (message: any, level: LogLevel = 'log') => {
  captureMessage({
    level,
    message,
  });

  if (getOptions().debug) {
    utils.originalConsole[level](...[message].filter((i) => i !== undefined));
  }
};

const error = (message: any) => {
  log(message, 'error');
};

const warn = (message: any) => {
  log(message, 'warn');
};

const debug = (message: any) => {
  log(message, 'debug');
};

const info = (message: any) => {
  log(message, 'info');
};

const Logger = () => ({
  name: 'LoggerPlugin',
  methods() {
    return {
      log,
      error,
      warn,
      info,
      debug,
    };
  },
});

export default Logger;
