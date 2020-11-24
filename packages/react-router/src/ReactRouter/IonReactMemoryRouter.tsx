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
      <Router {...props}>
        <IonRouter registerHistoryListener={this.registerHistoryListener}>{children}</IonRouter>
      </Router>
    );
  }
}
