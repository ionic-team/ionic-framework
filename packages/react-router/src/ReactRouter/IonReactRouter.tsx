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

 /**
  * history@4.x passes separate location and action
  * params. history@5.x passes location and action
  * together as a single object.
  * TODO: If support for React Router <=5 is dropped
  * this logic is no longer needed. We can just assume
  * a single object with both location and action.
  */
  handleHistoryChange(location: HistoryLocation, action: HistoryAction) {
   const locationValue = (location as any).location || location;
   const actionValue = (location as any).action || action;
   if (this.historyListenHandler) {
     this.historyListenHandler(locationValue, actionValue);
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
