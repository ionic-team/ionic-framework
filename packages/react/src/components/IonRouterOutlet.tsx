import type { JSX as LocalJSX } from '@ionic/core/components';
import type { PropsWithChildren } from 'react';
import React, { useContext } from 'react';

import { NavContext } from '../contexts/NavContext';
import OutletPageManager from '../routing/OutletPageManager';

import type { IonicReactProps } from './IonicReactProps';
import { IonRouterOutletInner } from './inner-proxies';
import { createForwardRef } from './utils';

type Props = LocalJSX.IonRouterOutlet & {
  basePath?: string;
  ref?: React.Ref<any>;
  ionPage?: boolean;
};

interface InternalProps extends Props {
  forwardedRef?: React.ForwardedRef<HTMLIonRouterOutletElement>;
}

const IonRouterOutletContainer = (props: PropsWithChildren<InternalProps>) => {
  const { hasIonicRouter, routeInfo, getStackManager } = useContext(NavContext);
  const { children, forwardedRef, ...restProps } = props;

  if (hasIonicRouter()) {
    const StackManager = getStackManager();

    if (restProps.ionPage) {
      return (
        <OutletPageManager StackManager={StackManager} routeInfo={routeInfo} {...restProps}>
          {children}
        </OutletPageManager>
      );
    }
    return (
      <StackManager routeInfo={routeInfo}>
        <IonRouterOutletInner {...restProps} forwardedRef={forwardedRef}>
          {children}
        </IonRouterOutletInner>
      </StackManager>
    );
  }

  return (
    <IonRouterOutletInner ref={forwardedRef} {...restProps}>
      {children}
    </IonRouterOutletInner>
  );
};

export const IonRouterOutlet = createForwardRef<Props & IonicReactProps, HTMLIonRouterOutletElement>(
  IonRouterOutletContainer,
  'IonRouterOutlet'
);
