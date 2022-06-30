import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
import React, { useState } from 'react';
import { ReactDelegate } from '../../framework-delegate';
import { createReactComponent } from '../react-component-lib';

const IonNavInner = createReactComponent('ion-nav', undefined, undefined, defineCustomElement);

export const IonNav = (props: any) => {
  const { children, ...restOfProps } = props;
  const [views, setViews] = useState<JSX.Element[]>([]);

  const addView = (view: JSX.Element) => {
    setViews([...views, view]);
  };
  const removeView = (view: JSX.Element) => setViews(views.filter((v) => v !== view));

  const delegate = ReactDelegate(addView, removeView);

  return (
    <IonNavInner delegate={delegate} {...restOfProps}>
      {views}
    </IonNavInner>
  );
};
