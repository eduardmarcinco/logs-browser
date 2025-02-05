import { BrowserLogsOptions } from './browserlogs';

const DEFAULT_INGESTION_URL = '';
const LOG_LINE_FLUSH_TIMEOUT = 250; // ms
const FLUSH_BYTE_LIMIT = 60 * 1024; // Max chrome allows with fetch and keep alive is 64kb, we are making it smaller to account for headers and unknowns
const SAMPLE_RATE = 100;

const STARTING_BACK_OFF = 1000; // 1 sec
const MAX_BACK_OFF = 60000; // 60 sec

const MAX_FETCH_ERROR_RETRY = 30;

const DEFAULT_TAG = 'BrowserLogs';

const SESSION_SCORE_KEY = 'logs::browser::sessionscore';
const SESSION_KEY = 'logs::browser::sessionid';

const DEFAULT_CONFIG: BrowserLogsOptions = {
  url: DEFAULT_INGESTION_URL,
  flushInterval: LOG_LINE_FLUSH_TIMEOUT,
  enableStacktrace: true,
  sampleRate: SAMPLE_RATE,
  tags: [],
  plugins: [],
  console: true,
  globalErrorHandlers: true,
  debug: false,
  disabled: false,
  hooks: {
    beforeSend: [],
  },
  disableInternalErrorLogger: false,
  internalErrorLoggerLevel: 'error',
};

export {
  DEFAULT_CONFIG,
  DEFAULT_INGESTION_URL,
  DEFAULT_TAG,
  FLUSH_BYTE_LIMIT,
  LOG_LINE_FLUSH_TIMEOUT,
  MAX_BACK_OFF,
  MAX_FETCH_ERROR_RETRY,
  SAMPLE_RATE,
  SESSION_KEY,
  SESSION_SCORE_KEY,
  STARTING_BACK_OFF,
};
