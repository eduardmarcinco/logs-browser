import { flush } from './buffer-manager';
import { DEFAULT_CONFIG, LOG_LINE_FLUSH_TIMEOUT } from './constants';
import { addDebugInfo } from './debug-info';
import { addDefaultPlugins, addPluginMethods, initPlugins } from './plugin-manager';
import utils from './utils';
import { validateOptions } from './validation';

import { BrowserLogsOptions } from './browserlogs';

import { BrowserLogsMethods } from './BrowserLogsMethods';

let options: BrowserLogsOptions = DEFAULT_CONFIG;

let isConfigCompleted = false;
let isInitCompleted = false;
let sampleRate: number;
let methods: BrowserLogsMethods = new BrowserLogsMethods();

const config = (ingestionKey: string, opts: BrowserLogsOptions = DEFAULT_CONFIG) => {
  options = Object.assign(DEFAULT_CONFIG, opts);
  options.ingestionKey = ingestionKey;
  options.tags = utils.parseTags(opts.tags);
  options.flushInterval =
    options.flushInterval == null || isNaN(options.flushInterval) || options.flushInterval < LOG_LINE_FLUSH_TIMEOUT ? LOG_LINE_FLUSH_TIMEOUT : options.flushInterval;

  validateOptions(options);
  addDefaultPlugins(options);
  addPluginMethods(options);

  isConfigCompleted = true;
};

const init = (ingestionKey: string, opts: BrowserLogsOptions = DEFAULT_CONFIG) => {
  if (ingestionKey) {
    config(ingestionKey, opts);
  }

  if (opts.disabled) {
    return;
  }

  utils.cacheConsole();
  sampleRate = utils.generateSampleRateScore();
  initPlugins(options);
  addFlushEvents();
  addDebugInfo();

  isInitCompleted = true;
};

const setIngestionKey = (ingestionKey: string) => {
  if (ingestionKey) {
    options.ingestionKey = ingestionKey;
  }
};

const getOptions = (): BrowserLogsOptions => options;
const isConfigured = (): Boolean => isConfigCompleted;
const isInitiated = (): Boolean => isInitCompleted;

const isSendingDisabled = (): Boolean => options.disabled || !utils.includeInSampleRate(options.sampleRate, sampleRate);

const addFlushEvents = () => {
  /* istanbul ignore next */
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  });

  // for safari
  /* istanbul ignore next */
  window.addEventListener('beforeunload', async () => {
    flush();
  });
};

export { config, getOptions, init, isConfigured, isInitiated, isSendingDisabled, methods, setIngestionKey };
