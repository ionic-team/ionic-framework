import { IonicConfig, setupConfig } from '@ionic/core';
import React from 'react';

import { IonAppInner } from './inner-proxies';

interface IonAppProps {
  initialConfig?: IonicConfig;
}

export const IonApp = class extends React.Component<IonAppProps> {

  constructor(props: IonAppProps) {
    super(props);
    if (props.initialConfig) {
      setupConfig(props.initialConfig);
    }
  }

  render() {
    return (
      <IonAppInner>{this.props.children}</IonAppInner>
    );
  }

  static get displayName() {
    return 'IonApp';
  }
};
