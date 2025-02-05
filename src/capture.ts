// All messages run through here
import { LogMessage } from './browserlogs';
import { process } from './buffer-manager';
import { getOptions, isSendingDisabled } from './init';
import utils from './utils';

const captureMessage = async ({ level = 'log', message }: LogMessage) => {
  if (isSendingDisabled()) return;

  if (message instanceof Error) {
    captureError(message);
    return;
  }

  await generateLogLine({ level, message });
};

const captureError = async (error: any, isUnhandledRejection = false) => {
  if (isSendingDisabled()) return;

  let message = error.name ? `${error.name}: ${error.message}` : error.message;

  if (isUnhandledRejection) {
    message = `Uncaught (in promise) ${message}`;
  }

  await generateLogLine({
    level: 'error',
    message,
  });
};

const generateLogLine = async ({ level = 'log', message }: LogMessage) => {
  const opts = getOptions();

  // run the beforeSend hooks
  const data: LogMessage = (getOptions().hooks || { beforeSend: [] }).beforeSend.reduce((acc: LogMessage, fn: Function) => (acc == null ? null : fn(acc)), {
    level,
    message,
  });

  // beforeSend stopped the log
  if (data == null) {
    return;
  }

  process({
    timestamp: Math.floor(Date.now() / 1000),
    log: typeof data.message === 'string' ? data.message : utils.stringify(data.message),
    level: data.level,
  });
};

const internalErrorLogger = (...args: any[]) => {
  if (getOptions().disableInternalErrorLogger) return;

  if (utils.isFunction(getOptions().internalErrorLogger)) {
    // @ts-ignore
    getOptions().internalErrorLogger(...args);
    return;
  }
  const logLevel = getOptions().internalErrorLoggerLevel ?? 'error';
  return utils.originalConsole[logLevel](...args);
};

export { captureError, captureMessage, internalErrorLogger };
