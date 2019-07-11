import React from 'react';
import { IonAppInner } from './inner-proxies';
import { IonicConfig } from '@ionic/core';
import { IonicContext, IonicContextState } from './utils/IonicContext';
import { Platform } from './utils/platform';
import { getConfig, setConfig } from './utils/config';

interface IonAppProps {
  initialConfig?: IonicConfig;
}

interface IonAppState extends IonicContextState { };

export class IonApp extends React.Component<IonAppProps, IonAppState> {

  constructor(props: IonAppProps) {
    super(props);

    const ionicPlatform = new Platform();
    this.state = {
      getConfig: getConfig,
      setConfig: setConfig,
      platform: ionicPlatform
    }
  }

  render() {
    return (
      <IonicContext.Provider value={this.state}>
        <IonAppInner>{this.props.children}</IonAppInner>
      </IonicContext.Provider>
    );
  }

};
