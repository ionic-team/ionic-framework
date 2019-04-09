import { Config } from './config';
import { createContext } from './context-util';

export interface Context {
  config: Config;
  isServer: boolean;
}

const { get, set } = createContext<Context>();

export const getContext = get;

export const setContext = set;
