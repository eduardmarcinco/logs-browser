import { addDebugInfo } from '../src/debug-info';

describe('debug-info.ts', () => {
  describe('addDebugInfo', () => {
    it('should return the debug object', () => {
      addDebugInfo();
      expect(window.__BROWSERLOGS__).toEqual(expect.any(Object));
      expect(window.__BROWSERLOGS__.version).toEqual(expect.any(String));
      expect(window.__BROWSERLOGS__.getOptions).toEqual(expect.any(Function));
      expect(window.__BROWSERLOGS__.getInstalledPlugins).toEqual(expect.any(Function));
    });
  });
});
