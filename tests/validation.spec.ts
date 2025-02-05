import { validateOptions } from '../src/validation';
import { DEFAULT_CONFIG } from '../src/constants';

const getOptions = (opts = {}) => ({ ...DEFAULT_CONFIG, ...opts });

describe('validation.ts', () => {
  describe('validateOptions', () => {
    describe('ingestion key', () => {
      it('should throw an error if no ingestion key is provided', () => {
        expect(() => validateOptions(getOptions())).toThrowError('Ingestion key can not be undefined when calling init');
      });
    });

    describe('sampleRate', () => {
      it('should throw an if there is no sample rate', () => {
        const options = getOptions({
          ingestionKey: '123',
          sampleRate: undefined,
        });
        expect(() => validateOptions(options)).toThrowError(`Browser Logs: \`sampleRate\` option must be a number between 0 and 100`);
      });

      it('should throw an if sample rate is negative number', () => {
        const options = getOptions({
          ingestionKey: '123',
          sampleRate: -100,
        });
        expect(() => validateOptions(options)).toThrowError(`Browser Logs: \`sampleRate\` option must be a number between 0 and 100`);
      });

      it('should throw an if sample rate is greater than 100', () => {
        const options = getOptions({
          ingestionKey: '123',
          sampleRate: 101,
        });
        expect(() => validateOptions(options)).toThrowError(`Browser Logs: \`sampleRate\` option must be a number between 0 and 100`);
      });

      it('should throw an if sample rate is NaN', () => {
        const options = getOptions({
          ingestionKey: '123',
          sampleRate: 'what?',
        });
        expect(() => validateOptions(options)).toThrowError(`Browser Logs: \`sampleRate\` option must be a number between 0 and 100`);
      });
    });

    describe('valid state', () => {
      it('should not throw when all options are valid', () => {
        const options = getOptions({
          ingestionKey: '123',
          sampleRate: 10,
        });
        expect(() => validateOptions(options)).not.toThrowError();
      });
    });
  });
});
