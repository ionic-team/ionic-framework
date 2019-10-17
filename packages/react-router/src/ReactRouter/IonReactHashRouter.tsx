import React from 'react';
import { HashRouter, HashRouterProps } from 'react-router-dom';

import { RouteManagerWithRouter } from './Router';

export const IonReactHashRouter = /*@__PURE__*/ (() => class IonReactHashRouterInternal extends React.Component<HashRouterProps> {
  render() {
    console.log('hash router in your bundle!!!');
    const { children, ...props } = this.props;
    return (
      <HashRouter {...props}>
        <RouteManagerWithRouter>{children}</RouteManagerWithRouter>
      </HashRouter>
    );
  }
})();
