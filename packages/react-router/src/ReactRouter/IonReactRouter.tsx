import { Action as HistoryAction, Location as HistoryLocation, createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { BrowserRouterProps, Router } from 'react-router-dom';

import { IonRouter } from './IonRouter';

export class IonReactRouter extends React.Component<BrowserRouterProps> {
  history = createHistory(this.props);
  historyListenHandler?: ((location: HistoryLocation, action: HistoryAction) => void);

  constructor(props: BrowserRouterProps) {
    super(props);
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
