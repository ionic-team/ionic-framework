import { FrameworkDelegate, JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';
import React from 'react';

import { ReactDelegate } from '../framework-delegate';

import { createReactComponent } from './react-component-lib';
import { camelToDashCase, isCoveredByReact } from './react-component-lib/utils';
import { createForwardRef } from './utils';

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
  onWillPresent,
  onDidPresent,
  onWillDismiss,
  onDidDismiss,
  ...restOfProps
}) => {
  const delegate = ReactDelegate(
    () => {},
    () => {}
  );

  const propsToPass = Object.keys(restOfProps).reduce((acc, name) => {
    if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
      const eventName = name.substring(2).toLowerCase();
      if (isCoveredByReact(eventName)) {
        (acc as any)[name] = (restOfProps as any)[name];
      }
    } else if (['string', 'boolean', 'number'].includes(typeof (restOfProps as any)[name])) {
      (acc as any)[camelToDashCase(name)] = (restOfProps as any)[name];
    }
    return acc;
  }, {});

  const mountContent = restOfProps.isOpen || restOfProps.keepContentsMounted;

  return (
    <IonModalInner
      delegate={delegate}
      ref={forwardedRef}
      {...propsToPass}
      onWillPresent={onWillPresent}
      onDidPresent={onDidPresent}
      onWillDismiss={onWillDismiss}
      onDidDismiss={onDidDismiss}
    >
      {mountContent && (
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
