import { RouterDirection } from '@ionic/core';
import { NavContext, NavContextState } from '@ionic/react';
import { Location as HistoryLocation, UnregisterCallback } from 'history';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { StackManager } from './StackManager';

interface NavManagerProps extends RouteComponentProps {
  onNavigateBack: (defaultHref?: string) => void;
  onNavigate: (type: 'push' | 'replace', path: string, state?: any) => void;
}

export class NavManager extends React.Component<NavManagerProps, NavContextState> {

  listenUnregisterCallback: UnregisterCallback | undefined;

  constructor(props: NavManagerProps) {
    super(props);
    this.state = {
      goBack: this.goBack.bind(this),
      hasIonicRouter: () => true,
      navigate: this.navigate.bind(this),
      getStackManager: this.getStackManager.bind(this),
      getPageManager: this.getPageManager.bind(this),
      currentPath: this.props.location.pathname,
      registerIonPage: () => { return; }, // overridden in View for each IonPage
      tabNavigate: this.tabNavigate.bind(this)
    };

    this.listenUnregisterCallback = this.props.history.listen((location: HistoryLocation) => {
      this.setState({
        currentPath: location.pathname
      });
    });

  }

  componentWillUnmount() {
    if (this.listenUnregisterCallback) {
      this.listenUnregisterCallback();
    }
  }

  goBack(defaultHref?: string) {
    this.props.onNavigateBack(defaultHref);
  }

  navigate(path: string, direction?: RouterDirection | 'none') {
    this.props.onNavigate('push', path, direction);
  }

  tabNavigate(path: string) {
    this.props.onNavigate('replace', path, 'back');
  }

  getPageManager() {
    return (children: any) => children;
  }

  getStackManager() {
    return StackManager;
  }

  render() {
    return (
      <NavContext.Provider value={this.state}>
        {this.props.children}
      </NavContext.Provider>
    );
  }

}
