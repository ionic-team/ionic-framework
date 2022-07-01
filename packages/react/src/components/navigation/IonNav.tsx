import type { FrameworkDelegate, JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
import React, { useState } from 'react';

import { ReactDelegate } from '../../framework-delegate';
import { createReactComponent } from '../react-component-lib';

const IonNavInner = createReactComponent<
  JSX.IonNav & { delegate: FrameworkDelegate },
  HTMLIonNavElement
>('ion-nav', undefined, undefined, defineCustomElement);

export const IonNav: React.FC<JSX.IonNav> = ({ children, ...restOfProps }) => {
  const [views, setViews] = useState<React.ReactPortal[]>([]);

  /**
   * Allows us to create React components that are rendered within
   * the context of the IonNav component.
   */
  const addView = (view: React.ReactPortal) => setViews([...views, view]);
  const removeView = (view: React.ReactPortal) => setViews(views.filter((v) => v !== view));

  const delegate = ReactDelegate(addView, removeView);

  return (
    <IonNavInner delegate={delegate} {...restOfProps}>
      {views}
    </IonNavInner>
  );
};
