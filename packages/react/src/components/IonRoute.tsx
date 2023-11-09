import React from 'react';

import { NavContext } from '../contexts/NavContext';

export interface IonRouteProps {
  path?: string;
  exact?: boolean;
  show?: boolean;
  render: (props?: any) => JSX.Element; // TODO(FW-2959): type
  disableIonPageManagement?: boolean;
  allowMultipleInstances?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IonRouteState {}

export class IonRoute extends React.PureComponent<IonRouteProps, IonRouteState> {
  context!: React.ContextType<typeof NavContext>;

  render() {
    const IonRouteInner = this.context.getIonRoute();

    if (!this.context.hasIonicRouter() || !IonRoute) {
      console.error('You either do not have an Ionic Router package, or your router does not support using <IonRoute>');
      return null;
    }

    return <IonRouteInner {...this.props} />;
  }

  static get contextType() {
    return NavContext;
  }
}
