import {
  Action as HistoryAction,
  History,
  Location as HistoryLocation,
  createBrowserHistory as createHistory,
} from 'history';
import React from 'react';
import { BrowserRouterProps, Router } from 'react-router-dom';

import { IonRouter } from './IonRouter';

interface IonReactRouterProps extends BrowserRouterProps {
  history?: History;
}

export class IonReactRouter extends React.Component<IonReactRouterProps> {
  historyListenHandler?: (location: HistoryLocation, action: HistoryAction) => void;
  history: History;

  constructor(props: IonReactRouterProps) {
    super(props);
    const { history, ...rest } = props;
    this.history = history || createHistory(rest);
    this.history.listen(this.handleHistoryChange.bind(this));
    this.registerHistoryListener = this.registerHistoryListener.bind(this);
  }

  handleHistoryChange(location: HistoryLocation, action: HistoryAction) {
    if (this.historyListenHandler) {
      this.historyListenHandler(location, action);
    }
  }

  registerHistoryListener(cb: (location: HistoryLocation, action: HistoryAction) => void) {
    this.historyListenHandler = cb;
  }

  render() {
    const { children, ...props } = this.props;
    return (
      <Router history={this.history} {...props}>
        <IonRouter registerHistoryListener={this.registerHistoryListener}>{children}</IonRouter>
      </Router>
    );
  }
}
