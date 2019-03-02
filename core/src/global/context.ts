import { Config } from './config';
import { createContext } from './context-util';

export interface Context {
  config: Config;
  isServer: boolean;
}

const context = createContext<Context>();

export const getContext = context.get;

export const setContext = context.set;
