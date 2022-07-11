import type { FrameworkDelegate, JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
import React, { useState } from 'react';

import { ReactDelegate } from '../../framework-delegate';
import { createReactComponent } from '../react-component-lib';

const IonNavInner = createReactComponent<
  JSX.IonNav & { delegate: FrameworkDelegate },
  HTMLIonNavElement
>('ion-nav', undefined, undefined, defineCustomElement);

export const IonNav: React.FC<JSX.IonNav> = ({ children, rootParams, ...restOfProps }) => {
  const [views, setViews] = useState<React.ReactElement[]>([]);

  /**
   * Allows us to create React components that are rendered within
   * the context of the IonNav component.
   */
  const addView = (view: React.ReactElement) => setViews([...views, view]);
  const removeView = (view: React.ReactElement) => setViews(views.filter((v) => v !== view));

  const delegate = ReactDelegate(addView, removeView);

  if (rootParams !== undefined) {
    console.warn(
      '[Ionic Warning]: IonNav: rootParams is not supported in React. Pass the props directly to the root component:\n' +
        '<IonNav root={() => <PageOne someString="Hello" someNumber={3} someBoolean={true} />} />'
    );
  }

  return (
    <IonNavInner delegate={delegate} {...restOfProps}>
      {views}
    </IonNavInner>
  );
};
