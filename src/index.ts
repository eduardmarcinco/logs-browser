import { BrowserLogsMethods } from './BrowserLogsMethods';
import { config, init, methods } from './init';
import plugins from './plugins';

BrowserLogsMethods.prototype.init = init;
BrowserLogsMethods.prototype.config = config;
BrowserLogsMethods.prototype.plugins = plugins;

export default methods;
