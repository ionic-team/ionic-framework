import { IonicConfig, setupConfig } from '@ionic/core';
import React from 'react';

import { IonAppInner } from './inner-proxies';

interface IonAppProps {
  /**
   * TODO
   */
  initialConfig?: IonicConfig;
}

export const IonApp: React.FC<IonAppProps> = ({ children, initialConfig }) => {

  if (initialConfig) {
    setupConfig(initialConfig);
  }

  return (
    <IonAppInner>{children}</IonAppInner>
  );
};
