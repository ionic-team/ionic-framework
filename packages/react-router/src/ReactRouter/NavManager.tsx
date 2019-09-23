import { RouterDirection } from '@ionic/core';
import { NavContext, NavContextState } from '@ionic/react';
import { Location as HistoryLocation, UnregisterCallback } from 'history';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { StackManager } from './StackManager';
import { generateUniqueId } from '../utils';
import { LocationHistory } from '../utils/LocationHistory'
import { ViewItem } from './ViewItem';
import { ViewStack } from './ViewStacks';

interface NavManagerProps extends RouteComponentProps {
  findViewInfoByLocation: (location: HistoryLocation) => {view?: ViewItem, viewStack?: ViewStack };
  findViewInfoById: (id: string) => {view?: ViewItem, viewStack?: ViewStack };
  getActiveIonPage: () => {view?: ViewItem, viewStack?: ViewStack };
};
interface NavManagerState extends NavContextState {};

export class NavManager extends React.Component<NavManagerProps, NavManagerState> {

  listenUnregisterCallback: UnregisterCallback;
  locationHistory: LocationHistory = new LocationHistory();

  constructor(props: NavManagerProps) {
    super(props);
    this.state = {
      goBack: this.goBack.bind(this),
      hasIonicRouter: () => true,
      getHistory: this.getHistory.bind(this),
      getLocation: this.getLocation.bind(this),
      navigate: this.navigate.bind(this),
      getStackManager: this.getStackManager.bind(this),
      getPageManager: this.getPageManager.bind(this),
      currentPath: this.props.location.pathname,
      registerIonPage: () => {} //overridden in View for each IonPage
    }

    this.listenUnregisterCallback = this.props.history.listen((location: HistoryLocation) => {
      this.setState({
        currentPath: location.pathname
      })
      this.locationHistory.add(location);
    });

    this.locationHistory.add({
      hash: window.location.hash,
      key: generateUniqueId(6),
      pathname: window.location.pathname,
      search: window.location.search,
      state: {}
    });
  }

  componentWillUnmount() {
    if(this.listenUnregisterCallback) {
      this.listenUnregisterCallback();
    }
  }

  goBack(defaultHref?: string) {
    const { view: activeIonPage } = this.props.getActiveIonPage();
    if (activeIonPage) {
      const { view: enteringView } = this.props.findViewInfoById(activeIonPage.prevId!);
      if (enteringView) {
        const lastLocation = this.locationHistory.findLastLocation(enteringView.routeData.match.url);
        if (lastLocation) {
          this.props.history.replace(lastLocation.pathname + lastLocation.search, { direction: 'back' });
        } else {
          this.props.history.replace(enteringView.routeData.match.url, { direction: 'back' });
        }
      } else {
        defaultHref && this.props.history.replace(defaultHref, { direction: 'back' });
      }
    } else {
      defaultHref && this.props.history.replace(defaultHref, { direction: 'back' });
    }
  }

  getHistory() {
    return this.props.history as any;
  }

  getLocation() {
    return this.props.location as any;
  }

  navigate(path: string, direction?: RouterDirection | 'none') {
    this.props.history.push(path, { direction });
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
