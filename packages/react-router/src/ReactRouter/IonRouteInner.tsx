import { IonRouteProps } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';

export class IonRouteInner extends React.PureComponent<IonRouteProps> {
  render() {
    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        render={this.props.render}
        computedMatch={(this.props as any).computedMatch}
      />
    );
  }
}
