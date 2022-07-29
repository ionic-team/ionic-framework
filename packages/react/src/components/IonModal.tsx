import { FrameworkDelegate, JSX } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';
import React, { useRef } from 'react';

import { ReactDelegate } from '../framework-delegate';

import { createReactComponent } from './react-component-lib';
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
  isOpen,
  ...restOfProps
}) => {
  const [isOpenState, setIsOpenState] = React.useState(isOpen ?? false);
  const wrapperRef = useRef(null);

  /**
   * The IonModal implementation is not reliant on the framework delegate
   * for adding or removing views. We construct an instance of the delegate
   * and pass it to the ion-modal element to opt-out of the core framework
   * delegate's behavior.
   */
  const delegate = ReactDelegate(
    () => {},
    () => {}
  );

  const mountContent = isOpenState || restOfProps.keepContentsMounted;

  return (
    <IonModalInner
      delegate={delegate}
      isOpen={isOpen}
      ref={forwardedRef}
      {...restOfProps}
      onWillPresent={(ev) => {
        setIsOpenState(true);
        if (restOfProps.onWillPresent) {
          restOfProps.onWillPresent(ev);
        }
      }}
      onDidDismiss={(ev) => {
        /**
         * Unmount the inner component.
         * React will call Node.removeChild
         * which expects the child to be
         * a direct descendent of the parent
         * but due to the presence of
         * Web Component slots, this is not
         * always the case. To work around this
         * we move the inner component to the root
         * of the Web Component so React can
         * cleanup properly.
         */
        const wrapper = wrapperRef.current;

        if (wrapper && forwardedRef) {
          const el = forwardedRef as React.MutableRefObject<HTMLIonModalElement>;
          if (el.current) {
            el.current.append(wrapper);
          }
          setIsOpenState(false);
        }

        if (restOfProps.onDidDismiss) {
          restOfProps.onDidDismiss(ev);
        }
      }}
    >
      {mountContent && (
        <div
          id="ion-react-wrapper"
          ref={wrapperRef}
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
