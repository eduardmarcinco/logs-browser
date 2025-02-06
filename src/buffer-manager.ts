import { BrowserLogsLogEntry } from './browserlogs';
import { internalErrorLogger } from './capture';
import { FLUSH_BYTE_LIMIT, LOG_LINE_FLUSH_TIMEOUT, MAX_BACK_OFF, MAX_FETCH_ERROR_RETRY, STARTING_BACK_OFF } from './constants';
import { getOptions } from './init';
import utils from './utils';

let buffer: BrowserLogsLogEntry[] = [];
let retryCount: number = 0;
let backOffInterval: number = 0;
let loggerError: boolean = false;
let timer: number | undefined;

const process = async (lines: BrowserLogsLogEntry | BrowserLogsLogEntry[]) => {
  if (Array.isArray(lines)) {
    buffer = buffer.concat(lines);
  } else {
    buffer.push(lines);
  }

  if (timer) {
    clearTimeout(timer);
  }

  if (!isUnderByteLimit(buffer)) {
    return await flush();
  }

  timer = setTimeout(async () => {
    await flush();
    timer = undefined;
  }, timeout());
};

const timeout = (): number | undefined => {
  if (retryCount > 0) {
    backOffInterval = utils.backOffWithJitter(STARTING_BACK_OFF, MAX_BACK_OFF, backOffInterval || STARTING_BACK_OFF);

    return backOffInterval;
  }

  return getOptions().flushInterval || LOG_LINE_FLUSH_TIMEOUT;
};

const splitAndFlush = async (logLines: BrowserLogsLogEntry[]) => {
  const lines: BrowserLogsLogEntry[] = [...logLines];
  const half: number = Math.floor(lines.length / 2);
  const lines2: BrowserLogsLogEntry[] = lines.splice(half);

  [lines, lines2].forEach(async (block) => await flush(block));
};

const isUnderByteLimit = (buffer: BrowserLogsLogEntry[]) => utils.jsonByteSize(buffer) < FLUSH_BYTE_LIMIT;

const flush = async (lines?: BrowserLogsLogEntry[]) => {
  if (!lines) {
    lines = [...buffer];
    buffer = [];
  }

  if (!lines.length) return;

  if (isUnderByteLimit(lines)) {
    await send(lines);
  } else if (lines.length === 1) {
    internalErrorLogger(`Browser Logs was unable to send the previous log lines because the log size was greater than ${FLUSH_BYTE_LIMIT} bytes`);
  } else {
    await splitAndFlush(lines);
  }
};

const send = async (lines: BrowserLogsLogEntry[]) => {
  const opts = getOptions();
  if (loggerError) {
    return;
  }

  const ingestUrl = `${opts.url}`;
  const errorMsg = 'Unable to send previous logs batch to backend';

  try {
    const response = await fetch(ingestUrl, {
      method: 'POST',
      keepalive: true,
      headers: {
        Authorization: `Bearer ${opts.ingestionKey}`,
        'Content-Type': 'application/json',
      },
      body: utils.stringify(lines),
    });

    if (response.ok) {
      retryCount = 0;
      backOffInterval = 0;
    } else {
      if (response.status >= 400 && response.status < 500) {
        internalErrorLogger(`${errorMsg}: ${response.statusText}`);
      } else if (response.status >= 500) {
        retryCount = retryCount + 1;
        if (retryCount > MAX_FETCH_ERROR_RETRY) {
          internalErrorLogger(`${errorMsg}: ${response.statusText}`);
        } else {
          await process(lines);
        }
      }
    }
  } catch (error) {
    // If we have any issues sending logs shut down the service immediately
    // This is to avoid ending up in a circular loop of error logs and causing app
    // performance issues or ddos-ing out api.
    loggerError = true;

    internalErrorLogger(
      `Browser Logs is unable to send logs to backend. 
      Error: ${(error as Error).message}
      `,
    );
  }
};

export { flush, process };
