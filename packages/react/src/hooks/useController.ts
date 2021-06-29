import { OverlayEventDetail } from '@ionic/core';
import { useMemo, useRef } from 'react';

import { attachProps } from '../components/utils';

import { HookOverlayOptions } from './HookOverlayOptions';

interface OverlayBase extends HTMLElement {
  present: () => Promise<void>;
  dismiss: (data?: any, role?: string | undefined) => Promise<boolean>;
}

export function useController<
  OptionsType,
  OverlayType extends OverlayBase
>(
  displayName: string,
  controller: { create: (options: OptionsType) => Promise<OverlayType> }
) {
  const overlayRef = useRef<OverlayType>();
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

    const handleDismiss = (event: CustomEvent<OverlayEventDetail<any>>) => {
      if (onDidDismiss) {
        onDidDismiss(event);
      }
      overlayRef.current = undefined;
    }

    overlayRef.current = await controller.create({
      ...(rest as any),
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
  };

  const dismiss = async () => {
    overlayRef.current && await overlayRef.current.dismiss();
    overlayRef.current = undefined;
  };

  return {
    present,
    dismiss,
  };
}
