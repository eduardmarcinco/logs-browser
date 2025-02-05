import { BrowserLogsOptions, Context, SessionId } from './browserlogs';

export class BrowserLogsMethods {}

export interface BrowserLogsMethods {
  init(ingestionKey: string, options?: BrowserLogsOptions): void;
  config(ingestionKey: string, options?: BrowserLogsOptions): void;
  plugins: any;
}
