export const dashToPascalCase = (str: string) => str.toLowerCase().split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
import { getPlatforms as getPlatformsCore, isPlatform as isPlatformCore, Platforms } from '@ionic/core';
import React from 'react';

export type IonicReactExternalProps<PropType, ElementType> = PropType & {
  ref?: React.RefObject<ElementType>;
  children?: React.ReactNode;
};

export const createForwardRef = <PropType, ElementType>(ReactComponent: any, displayName: string) => {
  const forwardRef = (props: IonicReactExternalProps<PropType, ElementType>, ref: React.Ref<ElementType>) => {
    return <ReactComponent {...props} forwardedRef={ref} />;
  };
  forwardRef.displayName = displayName;

  return React.forwardRef(forwardRef);
};

export * from './attachEventProps';
export { setupConfig } from '@ionic/core';

export const isPlatform = (platform: Platforms) => {
  return isPlatformCore(window, platform);
};

export const getPlatforms = () => {
  return getPlatformsCore(window);
};
