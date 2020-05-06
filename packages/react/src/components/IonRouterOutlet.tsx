
import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';

import { NavContext } from '../contexts/NavContext';

import { IonicReactProps } from './IonicReactProps';
import { IonRouterOutletInner } from './inner-proxies';
import { createForwardRef } from './utils';

type Props = LocalJSX.IonRouterOutlet & {
  ionPageContainer?: boolean;
  ref?: React.RefObject<any>;
};

interface InternalProps extends Props {
  forwardedRef?: React.RefObject<HTMLIonRouterOutletElement>;
}

interface InternalState {
  ionPageContainer: boolean;
}

class IonRouterOutletContainer extends React.Component<InternalProps, InternalState> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: InternalProps) {
    super(props);
    this.state = {
      ionPageContainer: !!this.props.ionPageContainer
    };
    this.registerIonPage = this.registerIonPage.bind(this);
  }

  registerIonPage() {
    this.setState({
      ionPageContainer: true
    });
  }

  render() {

    const StackManager = this.context.getStackManager();

    return (
      this.context.hasIonicRouter() ? (
        <StackManager routeInfo={this.context.routeInfo}>
          <IonRouterOutletInner {...this.props}>
            {this.props.children}
          </IonRouterOutletInner>
        </StackManager>
      ) : (
          <IonRouterOutletInner ref={this.props.forwardedRef} {...this.props}>
            {this.props.children}
          </IonRouterOutletInner>
        )
    );
  }

  static get contextType() {
    return NavContext;
  }
}

export const IonRouterOutlet = createForwardRef<Props & IonicReactProps, HTMLIonRouterOutletElement>(IonRouterOutletContainer, 'IonRouterOutlet');
