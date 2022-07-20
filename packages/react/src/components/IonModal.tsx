import React, { useState } from 'react';
import { FrameworkDelegate, JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';

import { createReactComponent } from './react-component-lib';
import { createForwardRef } from './utils';
import { ReactDelegate } from '../framework-delegate';

const IonModalInner = createReactComponent<
  JSX.IonModal & { delegate: FrameworkDelegate },
  HTMLIonModalElement
>('ion-modal', undefined, undefined, defineCustomElement);

type IonModalProps = JSX.IonModal & {
  forwardedRef?: React.ForwardedRef<HTMLIonModalElement>;
};

const IonModalInternal: React.FC<IonModalProps> = ({
  children,
  forwardedRef,
  isOpen,
  ...restOfProps
}) => {
  const [isOpenState, setIsOpenState] = React.useState(isOpen);
  const [views, setViews] = useState<React.ReactElement[]>([]);

  /**
   * Allows us to create React components that are rendered within
   * the context of the IonNav component.
   */
  const addView = (view: React.ReactElement) => setViews([...views, view]);
  const removeView = (view: React.ReactElement) => setViews(views.filter((v) => v !== view));

  const delegate = ReactDelegate(addView, removeView);

  return (
    <IonModalInner
      delegate={delegate}
      isOpen={isOpenState}
      ref={forwardedRef}
      {...restOfProps}
      onWillPresent={(ev) => {
        setIsOpenState(true);
        if (restOfProps.onWillPresent) {
          restOfProps.onWillPresent(ev);
        }
      }}
      onDidDismiss={(ev) => {
        setIsOpenState(false);
        if (restOfProps.onDidDismiss) {
          restOfProps.onDidDismiss(ev);
        }
      }}
    >
      {isOpenState && (
        <div
          id="ion-react-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {children}
        </div>
      )}
    </IonModalInner>
  );
};

export const IonModal = createForwardRef<IonModalProps, HTMLIonModalElement>(
  IonModalInternal,
  'IonModal'
);
