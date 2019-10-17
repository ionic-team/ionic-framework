import React from 'react';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';

import { RouteManagerWithRouter } from './Router';

export const IonReactRouter = /*@__PURE__*/ (() => class IonReactRouterInternal extends React.Component<BrowserRouterProps> {
  render() {
    const { children, ...props } = this.props;
    return (
      <BrowserRouter {...props}>
        <RouteManagerWithRouter>{children}</RouteManagerWithRouter>
      </BrowserRouter>
    );
  }
})();
