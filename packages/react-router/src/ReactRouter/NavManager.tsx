import { RouterDirection } from '@ionic/core';
import { NavContext, NavContextState } from '@ionic/react-core';
import { Location as HistoryLocation } from 'history';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ViewManager } from './ViewManager';

interface NavManagerProps extends RouteComponentProps {
  findViewInfoByLocation: (location: HistoryLocation) => any;
  findViewInfoById: (id: string) => any;
};
interface NavManagerState extends NavContextState {};

export class NavManager extends React.Component<NavManagerProps, NavManagerState> {

  constructor(props: NavManagerProps) {
    super(props);
    this.state ={
      goBack: this.goBack.bind(this),
      hasIonicRouter: () => true,
      getHistory: this.getHistory.bind(this),
      getLocation: this.getLocation.bind(this),
      navigate: this.navigate.bind(this),
      getViewManager: this.getViewManager.bind(this),
    }
  }

  goBack = (defaultHref?: string) => {
    const { view: leavingView } = this.props.findViewInfoByLocation(this.props.location);
    if (leavingView) {
      const { view: enteringView } = this.props.findViewInfoById(leavingView.prevId);
      if (enteringView) {
        this.props.history.replace(enteringView.routeData.match.url, { direction: 'back' });
      } else {
        this.props.history.replace(defaultHref, { direction: 'back' });
      }
    } else {
      this.props.history.replace(defaultHref, { direction: 'back' });
    }
  }

  getHistory = () => {
    return this.props.history;
  }

  getLocation = () => {
    return this.props.location;
  }

  navigate(path: string, direction?: RouterDirection) {
    this.props.history.push(path, { direction });
  }

  getViewManager = () => {
    return ViewManager;
  }

  render() {
    return (
      <NavContext.Provider value={this.state}>
        {this.props.children}
      </NavContext.Provider>
    );
  }

}
