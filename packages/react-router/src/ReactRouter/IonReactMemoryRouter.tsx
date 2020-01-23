import { MemoryHistory } from 'history';
import React from 'react';
import { MemoryRouter, MemoryRouterProps, matchPath } from 'react-router';

import { LocationState, RouteManager } from './Router';

interface IonReactMemoryRouterProps extends MemoryRouterProps {
  history: MemoryHistory<LocationState>;
}

export class IonReactMemoryRouter extends React.Component<IonReactMemoryRouterProps> {
  render() {
    const { children, history, ...props } = this.props;
    const match = matchPath(history.location.pathname, this.props);
    return (
      <MemoryRouter {...props}>
        <RouteManager history={history} location={history.location} match={match!}>{children}</RouteManager>
      </MemoryRouter>
    );
  }
}
