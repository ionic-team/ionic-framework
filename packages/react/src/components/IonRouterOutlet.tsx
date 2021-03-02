import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';

import { NavContext } from '../contexts/NavContext';
import OutletPageManager from '../routing/OutletPageManager';

import { IonicReactProps } from './IonicReactProps';
import { IonRouterOutletInner } from './inner-proxies';
import { createForwardRef } from './utils';

type Props = LocalJSX.IonRouterOutlet & {
  basePath?: string;
  ref?: React.RefObject<any>;
  ionPage?: boolean;
};

interface InternalProps extends Props {
  forwardedRef?: React.RefObject<HTMLIonRouterOutletElement>;
}

interface InternalState {}

class IonRouterOutletContainer extends React.Component<InternalProps, InternalState> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: InternalProps) {
    super(props);
  }

  render() {
    const StackManager = this.context.getStackManager();
    const { children, forwardedRef, ...props } = this.props;

    return this.context.hasIonicRouter() ? (
      props.ionPage ? (
        <OutletPageManager
          StackManager={StackManager}
          routeInfo={this.context.routeInfo}
          {...props}
        >
          {children}
        </OutletPageManager>
      ) : (
        <StackManager routeInfo={this.context.routeInfo}>
          <IonRouterOutletInner {...props} forwardedRef={forwardedRef}>
            {children}
          </IonRouterOutletInner>
        </StackManager>
      )
    ) : (
      <IonRouterOutletInner ref={forwardedRef} {...this.props}>
        {this.props.children}
      </IonRouterOutletInner>
    );
  }

  static get contextType() {
    return NavContext;
  }
}

export const IonRouterOutlet = createForwardRef<
  Props & IonicReactProps,
  HTMLIonRouterOutletElement
>(IonRouterOutletContainer, 'IonRouterOutlet');
