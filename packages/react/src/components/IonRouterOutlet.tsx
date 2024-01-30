import type { JSX as LocalJSX } from '@ionic/core/components';
import React from 'react';

import { NavContext } from '../contexts/NavContext';
import OutletPageManager from '../routing/OutletPageManager';

import type { IonicReactProps } from './IonicReactProps';
import { IonRouterOutletInner } from './inner-proxies';
import { createForwardRef } from './utils';

type Props = LocalJSX.IonRouterOutlet & {
  basePath?: string;
  ref?: React.Ref<any>;
  ionPage?: boolean;
  // TODO: Refactor type with PropsWithChildren when moving to React v18
  children?: React.ReactNode;
};

interface InternalProps extends Props {
  forwardedRef?: React.ForwardedRef<HTMLIonRouterOutletElement>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
        <OutletPageManager StackManager={StackManager} routeInfo={this.context.routeInfo} {...props}>
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

export const IonRouterOutlet = createForwardRef<Props & IonicReactProps, HTMLIonRouterOutletElement>(
  IonRouterOutletContainer,
  'IonRouterOutlet'
);
