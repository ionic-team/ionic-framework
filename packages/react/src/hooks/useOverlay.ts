import type { OverlayEventDetail } from '@ionic/core/components';
import React, { createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { attachProps } from '../components/react-component-lib/utils';
import { IonContext } from '../contexts/IonContext';
import type { ReactComponentOrElement } from '../models/ReactComponentOrElement';
import { generateId } from '../utils/generateId';

import type { HookOverlayOptions } from './HookOverlayOptions';

// TODO(FW-2959): types

interface OverlayBase extends HTMLElement {
  present: () => Promise<void>;
  dismiss: (data?: any, role?: string | undefined) => Promise<boolean>;
}

export function useOverlay<OptionsType, OverlayType extends OverlayBase>(
  displayName: string,
  controller: { create: (options: OptionsType) => Promise<OverlayType> },
  defineCustomElement: () => void,
  component: ReactComponentOrElement,
  componentProps?: any
) {
  const overlayRef = useRef<OverlayType>();
  const containerElRef = useRef<HTMLDivElement>();
  const didDismissEventName = useMemo(() => `on${displayName}DidDismiss`, [displayName]);
  const didPresentEventName = useMemo(() => `on${displayName}DidPresent`, [displayName]);
  const willDismissEventName = useMemo(() => `on${displayName}WillDismiss`, [displayName]);
  const willPresentEventName = useMemo(() => `on${displayName}WillPresent`, [displayName]);
  const [isOpen, setIsOpen] = useState(false);
  const ionContext = useContext(IonContext);
  const [overlayId] = useState(generateId('overlay'));

  defineCustomElement();

  useEffect(() => {
    if (isOpen && component && containerElRef.current) {
      if (React.isValidElement(component)) {
        ionContext.addOverlay(overlayId, component, containerElRef.current!);
      } else {
        const element = createElement(component as React.ComponentClass, componentProps);
        ionContext.addOverlay(overlayId, element, containerElRef.current!);
      }
    }
  }, [component, containerElRef.current, isOpen, componentProps]);

  const present = useCallback(async (options: OptionsType & HookOverlayOptions) => {
    if (overlayRef.current) {
      return;
    }

    const { onDidDismiss, onWillDismiss, onDidPresent, onWillPresent, ...rest } = options;

    if (typeof document !== 'undefined') {
      containerElRef.current = document.createElement('div');
    }

    overlayRef.current = await controller.create({
      ...(rest as any),
      component: containerElRef.current,
    });

    attachProps(overlayRef.current, {
      [didDismissEventName]: handleDismiss,
      [didPresentEventName]: (e: CustomEvent) => onDidPresent && onDidPresent(e),
      [willDismissEventName]: (e: CustomEvent) => onWillDismiss && onWillDismiss(e),
      [willPresentEventName]: (e: CustomEvent) => onWillPresent && onWillPresent(e),
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
      ionContext.removeOverlay(overlayId);
    }
  }, []);

  const dismiss = useCallback(async (data?: any, role?: string) => {
    overlayRef.current && (await overlayRef.current.dismiss(data, role));
    overlayRef.current = undefined;
    containerElRef.current = undefined;
  }, []);

  return {
    present,
    dismiss,
  };
}
