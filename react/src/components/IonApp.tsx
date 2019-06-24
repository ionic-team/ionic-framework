import React from 'react';
import { IonAppInner } from './proxies';
import { IonicConfig, setupConfig } from '@ionic/core';
import { arrowBack } from 'ionicons/icons';
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

    const { initialConfig: config = {} } = this.props;
    if (config) {
      setupConfig(Object.assign({ backButtonIcon: arrowBack }, config));
    }

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

export default IonAppProps;
