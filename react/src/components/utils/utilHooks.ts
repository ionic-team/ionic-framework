import React from 'react';
import { IonicContext } from './IonicContext';
import { IonicConfig } from '@ionic/core';

export const useIonicConfig = () => {
  const value = React.useContext(IonicContext);
  const config = value.getConfig() || {};
  const hook: [IonicConfig, (config: IonicConfig) => void] = [config, value.setConfig];
  return hook;
}
