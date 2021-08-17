import { Action as HistoryAction, Location as HistoryLocation, MemoryHistory } from 'history';
import React from 'react';
import { MemoryRouterProps, Router } from 'react-router';

import { IonRouter } from './IonRouter';

interface IonReactMemoryRouterProps extends MemoryRouterProps {
  history: MemoryHistory;
}

export class IonReactMemoryRouter extends React.Component<IonReactMemoryRouterProps> {
  history: MemoryHistory;
  historyListenHandler?: (location: HistoryLocation, action: HistoryAction) => void;

  constructor(props: IonReactMemoryRouterProps) {
    super(props);
    this.history = props.history;
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
      <Router {...props}>
        <IonRouter registerHistoryListener={this.registerHistoryListener}>{children}</IonRouter>
      </Router>
    );
  }
}
