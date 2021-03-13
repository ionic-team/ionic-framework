import {
  Config as CoreConfig,
  Platforms,
  getPlatforms as getPlatformsCore,
  isPlatform as isPlatformCore,
} from '@ionic/core';
import React from 'react';

import { IonicReactProps } from '../IonicReactProps';

export type IonicReactExternalProps<PropType, ElementType> = PropType &
  Omit<React.HTMLAttributes<ElementType>, 'style'> &
  IonicReactProps;

export const createForwardRef = <PropType, ElementType>(
  ReactComponent: any,
  displayName: string
) => {
  const forwardRef = (
    props: IonicReactExternalProps<PropType, ElementType>,
    ref: React.Ref<ElementType>
  ) => {
    return <ReactComponent {...props} forwardedRef={ref} />;
  };
  forwardRef.displayName = displayName;

  return React.forwardRef(forwardRef);
};

export * from './attachProps';
export * from './case';

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
