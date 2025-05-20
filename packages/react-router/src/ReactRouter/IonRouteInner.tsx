import type { IonRouteProps } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';

export class IonRouteInner extends React.PureComponent<IonRouteProps> {
  render() {
    return <Route path={this.props.path} end={this.props.end} element={this.props.element} />;
  }
}
