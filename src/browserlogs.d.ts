import { GlobalErrorHandlerPlugin } from './plugins/global-handler';
declare module 'logdna-browser-2' {}

interface BrowserLogsMethods {}

// This is fallback to 3rd party plugin methods
// Until TS has better Module Augmentation without
// relative paths https://github.com/Microsoft/TypeScript/issues/18877
declare module './BrowserLogsMethods' {
  interface BrowserLogsMethods {
    log(message: any, level?: LogLevel): void;
    error(message: any, level?: LogLevel): void;
    warn(message: any, level?: LogLevel): void;
    info(message: any, level?: LogLevel): void;
    debug(message: any, level?: LogLevel): void;
  }
}

declare module './BrowserLogsMethods' {
  interface BrowserLogsMethods {
    mark(name: string): void;
    measure(name: string, start: string, end: string): void;
  }
}

export type BrowserLogsLogEntry = {
  log: string;
  timestamp: string;
  level: string;
  statusCode?: number;
};

interface ConsoleOptions {
  enable?: boolean;
  integrations?: LogLevel[];
}

export type BrowserLogsOptions = {
  url?: string;
  ingestionKey?: string;
  flushInterval?: number;
  enableStacktrace?: boolean;
  sampleRate?: number;
  tags?: Tags;
  plugins?: Plugin[];
  console?: ConsoleOptions | boolean;
  globalErrorHandlers?: GlobalErrorHandlerPlugin | boolean;
  debug?: boolean;
  disabled?: boolean;
  hooks?: HooksOption;
  internalErrorLogger?: Function;
  disableInternalErrorLogger?: Boolean;
  internalErrorLoggerLevel?: LogLevel;
};

export type ErrorContext = {
  colno?: number;
  lineno?: number;
  stacktrace?: string;
  source?: string;
};

export type LogMessage = {
  level: LogLevel;
  message: any;
  errorContext?: ErrorContext | null | undefined;
  disableStacktrace?: boolean;
};

export type Context = {
  [key: string]: any;
};

export type SessionId = string;

export type Tags = string | string[];

export type LogLevel = 'log' | 'debug' | 'error' | 'warn' | 'info';

export type Plugin = {
  name: string;
  init?: Function;
  methods?: Function;
  hooks?: Hooks;
};

type Hooks = {
  beforeSend: BeforeSendHook;
};

type BeforeSendHook = (logMessage: LogMessage) => LogMessage;

type HooksOption = {
  beforeSend: BeforeSendHook[];
};
