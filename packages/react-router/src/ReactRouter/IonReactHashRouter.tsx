import React from 'react';
import { HashRouter, HashRouterProps } from 'react-router-dom';

import { RouteManagerWithRouter } from './Router';

export class IonReactHashRouter extends React.Component<HashRouterProps> {
  render() {
    const { children, ...props } = this.props;
    return (
      <HashRouter {...props}>
        <RouteManagerWithRouter>{children}</RouteManagerWithRouter>
      </HashRouter>
    );
  }
}
