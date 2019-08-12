import React from 'react';
import { Platform } from './platform';
import { IonicConfig } from '@ionic/core';

export interface IonicContextState {
  getConfig: () => IonicConfig | void;
  setConfig: (config: IonicConfig) => void;
  platform: Platform | undefined;
}

export const IonicContext = /*@__PURE__*/React.createContext<IonicContextState>({
  getConfig: () => {},
  setConfig: () => {},
  platform: undefined
});
