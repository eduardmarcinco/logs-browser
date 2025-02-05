import { BrowserLogsOptions } from './browserlogs';

const validateOptions = (opts: BrowserLogsOptions) => {
  if (opts.ingestionKey == null) {
    throw new Error('Ingestion key can not be undefined when calling init');
  }

  if (opts.sampleRate == null || opts.sampleRate < 0 || opts.sampleRate > 100 || isNaN(opts.sampleRate)) {
    throw new Error(`Browser Logs: \`sampleRate\` option must be a number between 0 and 100`);
  }
};

export { validateOptions };
