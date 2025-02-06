import { BrowserLogsMethods } from './BrowserLogsMethods';
import { config, init, methods, refreshIngestionKey } from './init';
import plugins from './plugins';

BrowserLogsMethods.prototype.init = init;
BrowserLogsMethods.prototype.config = config;
BrowserLogsMethods.prototype.plugins = plugins;
BrowserLogsMethods.prototype.refreshIngestionKey = refreshIngestionKey;

export default methods;
