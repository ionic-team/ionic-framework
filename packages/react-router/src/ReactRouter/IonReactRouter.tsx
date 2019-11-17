import React from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';

import { RouteManagerWithRouter } from './Router';

export class IonReactRouter extends React.Component<BrowserRouterProps> {
  render() {
    const { children, ...props } = this.props;
    return (
      <BrowserRouter {...props}>
        <RouteManagerWithRouter>{children}</RouteManagerWithRouter>
      </BrowserRouter>
    );
  }
}
