import type { FrameworkDelegate, JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
import React, { useState } from 'react';

import { ReactDelegate } from '../../framework-delegate';
import { createReactComponent } from '../react-component-lib';
import { createForwardRef } from '../utils';

const IonNavInner = createReactComponent<
  JSX.IonNav & { delegate: FrameworkDelegate },
  HTMLIonNavElement
>('ion-nav', undefined, undefined, defineCustomElement);

type IonNavProps = JSX.IonNav & {
  forwardedRef?: React.ForwardedRef<HTMLIonNavElement>;
};

const IonNavInternal: React.FC<IonNavProps> = ({ children, forwardedRef, ...restOfProps }) => {
  const [views, setViews] = useState<React.ReactElement[]>([]);

  /**
   * Allows us to create React components that are rendered within
   * the context of the IonNav component.
   */
  const addView = (view: React.ReactElement) => setViews([...views, view]);
  const removeView = (view: React.ReactElement) => setViews(views.filter((v) => v !== view));

  const delegate = ReactDelegate(addView, removeView);

  return (
    <IonNavInner delegate={delegate} ref={forwardedRef} {...restOfProps}>
      {views}
    </IonNavInner>
  );
};

export const IonNav = createForwardRef<IonNavProps, HTMLIonNavElement>(IonNavInternal, 'IonNav');
