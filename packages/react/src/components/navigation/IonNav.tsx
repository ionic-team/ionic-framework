import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
import React, { useState } from 'react';
import type { FrameworkDelegate, JSX as IonicJSX } from '@ionic/core/components';
import { ReactDelegate } from '../../framework-delegate';
import { createReactComponent } from '../react-component-lib';

const IonNavInner = createReactComponent<
  IonicJSX.IonNav & { delegate: FrameworkDelegate },
  HTMLIonNavElement
>('ion-nav', undefined, undefined, defineCustomElement);

export const IonNav: React.FC<IonicJSX.IonNav> = ({ children, ...restOfProps }) => {
  const [views, setViews] = useState<JSX.Element[]>([]);

  /**
   * Allows us to create React components that are rendered within
   * the context of the IonNav component.
   */
  const addView = (view: JSX.Element) => setViews([...views, view]);
  const removeView = (view: JSX.Element) => {
    const filteredViews = views.filter((v) => v !== view);
    console.log('setting views to', filteredViews);
    setViews(filteredViews);
  };

  const delegate = ReactDelegate(addView, removeView);

  console.log('rendering views', views);

  return (
    <IonNavInner delegate={delegate} {...restOfProps}>
      {views}
    </IonNavInner>
  );
};
