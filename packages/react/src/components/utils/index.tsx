import type { Config as CoreConfig, Platforms } from '@ionic/core/components';
import { getPlatforms as getPlatformsCore, isPlatform as isPlatformCore } from '@ionic/core/components';
import React from 'react';

import type { IonicReactProps } from '../IonicReactProps';

export type IonicReactExternalProps<PropType, ElementType> = PropType &
  /**
   * TODO: FW-5753
   *
   * The `placeholder` property was removed from `HTMLAttributes` in @types/react@18.2.43
   * https://github.com/DefinitelyTyped/DefinitelyTyped/commit/b954269038de46b4b2f1756a9f2f020cbc66a326
   *
   * This is a temporary workaround until @ionic/react is updated to >=18.2.43.
   */
  Omit<React.HTMLAttributes<ElementType>, 'style' | 'placeholder'> &
  IonicReactProps;

export const createForwardRef = <PropType, ElementType>(
  ReactComponent: any, // TODO(FW-2959): type
  displayName: string
) => {
  const forwardRef = (props: IonicReactExternalProps<PropType, ElementType>, ref: React.ForwardedRef<ElementType>) => {
    return <ReactComponent {...props} forwardedRef={ref} />;
  };
  forwardRef.displayName = displayName;

  return React.forwardRef(forwardRef);
};

export const isPlatform = (platform: Platforms) => {
  return isPlatformCore(window, platform);
};

export const getPlatforms = () => {
  return getPlatformsCore(window);
};

export const getConfig = (): CoreConfig | null => {
  if (typeof (window as any) !== 'undefined') {
    const Ionic = (window as any).Ionic;
    if (Ionic && Ionic.config) {
      return Ionic.config;
    }
  }
  return null;
};
