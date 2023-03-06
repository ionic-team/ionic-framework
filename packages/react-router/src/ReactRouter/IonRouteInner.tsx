import type { IonRouteProps } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';

export class IonRouteInner extends React.PureComponent<IonRouteProps> {
  render() {
    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        render={this.props.render}
        /**
         * `computedMatch` is a private API in react-router v5 that
         * has been removed in v6.
         *
         * This needs to be removed when we support v6.
         *
         * TODO: FW-647
         */
        computedMatch={(this.props as any).computedMatch}
      />
    );
  }
}
