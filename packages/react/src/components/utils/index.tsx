import type { Config as CoreConfig, Platforms } from '@ionic/core/components';
import { getPlatforms as getPlatformsCore, isPlatform as isPlatformCore } from '@ionic/core/components';
import React from 'react';

import type { IonicReactProps } from '../IonicReactProps';

export type IonicReactExternalProps<PropType, ElementType> = PropType &
  Omit<React.HTMLAttributes<ElementType>, 'style'> &
  IonicReactProps;

export const createForwardRef = <PropType, ElementType>(
  ReactComponent: any, // TODO(FW-2959): type
  displayName: string
) => {
  const forwardRef = (
    props: React.PropsWithoutRef<IonicReactExternalProps<PropType, ElementType>>,
    ref: React.ForwardedRef<ElementType>
  ) => {
    return <ReactComponent {...props} forwardedRef={ref} />;
  };
  forwardRef.displayName = displayName;

  // Cast the render function to the type React.forwardRef already infers for it.
  // React 18's `forwardRef` wraps the props in `PropsWithoutRef`, and since
  // `PropType` is unconstrained TypeScript can't prove the round-trip is safe.
  // The cast keeps the inferred component type intact without widening to `any`.
  return React.forwardRef(
    forwardRef as React.ForwardRefRenderFunction<
      ElementType,
      React.PropsWithoutRef<IonicReactExternalProps<PropType, ElementType>>
    >
  );
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
