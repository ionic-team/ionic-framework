import { OverlayEventDetail } from '@ionic/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { attachProps } from '../components/utils';

import { HookOverlayOptions } from './HookOverlayOptions';

export type ReactComponentOrElement = React.ComponentClass<any, any> | React.FC<any> | JSX.Element;

interface OverlayBase extends HTMLElement {
  present: () => Promise<void>;
  dismiss: (data?: any, role?: string | undefined) => Promise<boolean>;
}

export function useOverlay<
  OptionsType,
  OverlayType extends OverlayBase
>(
  displayName: string,
  controller: { create: (options: OptionsType) => Promise<OverlayType>; },
  component: ReactComponentOrElement,
  componentProps?: any
) {
  const overlayRef = useRef<OverlayType>();
  const containerElRef = useRef<HTMLDivElement>();
  const didDismissEventName = useMemo(
    () => `on${displayName}DidDismiss`,
    [displayName]
  );
  const didPresentEventName = useMemo(
    () => `on${displayName}DidPresent`,
    [displayName]
  );
  const willDismissEventName = useMemo(
    () => `on${displayName}WillDismiss`,
    [displayName]
  );
  const willPresentEventName = useMemo(
    () => `on${displayName}WillPresent`,
    [displayName]
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && component && containerElRef.current) {
      if (React.isValidElement(component)) {
        ReactDOM.render(component, containerElRef.current);
      } else {
        ReactDOM.render(React.createElement(component as React.ComponentClass, componentProps), containerElRef.current);
      }
    }
  }, [component, containerElRef.current, isOpen, componentProps]);

  const present = async (options: OptionsType & HookOverlayOptions) => {
    if (overlayRef.current) {
      return;
    }

    const {
      onDidDismiss,
      onWillDismiss,
      onDidPresent,
      onWillPresent,
      ...rest
    } = options;

    if (typeof document !== 'undefined') {
      containerElRef.current = document.createElement('div');
    }

    overlayRef.current = await controller.create({
      ...(rest as any),
      component: containerElRef.current
    });

    attachProps(overlayRef.current, {
      [didDismissEventName]: handleDismiss,
      [didPresentEventName]: (e: CustomEvent) =>
        onDidPresent && onDidPresent(e),
      [willDismissEventName]: (e: CustomEvent) =>
        onWillDismiss && onWillDismiss(e),
      [willPresentEventName]: (e: CustomEvent) =>
        onWillPresent && onWillPresent(e),
    });

    overlayRef.current.present();

    setIsOpen(true);

    function handleDismiss(event: CustomEvent<OverlayEventDetail<any>>) {
      if (onDidDismiss) {
        onDidDismiss(event);
      }
      overlayRef.current = undefined;
      containerElRef.current = undefined;
      setIsOpen(false);
    }
  };

  const dismiss = async () => {
    overlayRef.current && await overlayRef.current.dismiss();
    overlayRef.current = undefined;
    containerElRef.current = undefined;
  };

  return {
    present,
    dismiss,
  };
}
