import type { FrameworkDelegate, JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
import React, { useMemo, useState } from 'react';

import { ReactDelegate } from '../../framework-delegate';
import { createReactComponent } from '../react-component-lib';
import { createForwardRef } from '../utils';

const IonNavInner = createReactComponent<JSX.IonNav & { delegate: FrameworkDelegate }, HTMLIonNavElement>(
  'ion-nav',
  undefined,
  undefined,
  defineCustomElement
);

type IonNavProps = JSX.IonNav & {
  forwardedRef?: React.ForwardedRef<HTMLIonNavElement>;
  // TODO: Refactor type with PropsWithChildren when moving to React v18
  children?: React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IonNavInternal: React.FC<IonNavProps> = ({ children, forwardedRef, ...restOfProps }) => {
  const [views, setViews] = useState<React.ReactElement[]>([]);

  /**
   * Allows us to create React components that are rendered within
   * the context of the IonNav component.
   */
  const addView = (view: React.ReactElement) => setViews((existingViews) => [...existingViews, view]);
  const removeView = (view: React.ReactElement) => setViews((existingViews) => existingViews.filter((v) => v !== view));

  const delegate = useMemo(() => ReactDelegate(addView, removeView), []);

  return (
    <IonNavInner delegate={delegate} ref={forwardedRef} {...restOfProps}>
      {views}
    </IonNavInner>
  );
};

export const IonNav = createForwardRef<IonNavProps, HTMLIonNavElement>(IonNavInternal, 'IonNav');
