import { getOptions } from './init';
import { getInstalledPlugins } from './plugin-manager';
import { getVersion } from './version';

type BrowserLogsWindow = {
  version: string;
  getOptions: Function;
  getInstalledPlugins: Function;
};

declare global {
  interface Window {
    __BROWSERLOGS__: BrowserLogsWindow;
  }
}

export const addDebugInfo = () => {
  if (typeof window !== 'undefined') {
    window.__BROWSERLOGS__ = window.__BROWSERLOGS__ || {
      version: getVersion(),
      getOptions,
      getInstalledPlugins,
    };
  }
};
