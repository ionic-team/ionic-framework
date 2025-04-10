import React from 'react';

import { printIonError } from '@ionic/core';

import { NavContext } from '../contexts/NavContext';

export interface IonRedirectProps {
  path?: string;
  exact?: boolean;
  to: string;
  routerOptions?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IonRedirectState {}

export class IonRedirect extends React.PureComponent<IonRedirectProps, IonRedirectState> {
  context!: React.ContextType<typeof NavContext>;

  render() {
    const IonRedirectInner = this.context.getIonRedirect();

    if (!this.context.hasIonicRouter() || !IonRedirect) {
      printIonError(
        'You either do not have an Ionic Router package, or your router does not support using <IonRedirect>'
      );
      return null;
    }

    return <IonRedirectInner {...this.props} />;
  }

  static get contextType() {
    return NavContext;
  }
}
