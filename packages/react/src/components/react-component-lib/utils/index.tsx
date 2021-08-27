import React from 'react';

import type { StyleReactProps } from '../interfaces';

export type StencilReactExternalProps<PropType, ElementType> = PropType &
  Omit<React.HTMLAttributes<ElementType>, 'style'> &
  StyleReactProps;

export const setRef = (ref: React.ForwardedRef<any> | React.Ref<any> | undefined, value: any) => {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref != null) {
    // Cast as a MutableRef so we can assign current
    (ref as React.MutableRefObject<any>).current = value
  }
};

// The comma in the type is to trick typescript because it things a single generic in a tsx file is jsx
export const mergeRefs = (
  ...refs: (React.ForwardedRef<any> | React.Ref<any> | undefined)[]
): React.RefCallback<any> => {
  return (value: any) => {
    refs.forEach(ref => {
      setRef(ref, value)
    })
  }
};

export const createForwardRef = <PropType, ElementType>(
  ReactComponent: any,
  displayName: string,
) => {
  const forwardRef = (
    props: StencilReactExternalProps<PropType, ElementType>,
    ref: React.ForwardedRef<ElementType>,
  ) => {
    return <ReactComponent {...props} forwardedRef={ref} />;
  };
  forwardRef.displayName = displayName;

  return React.forwardRef(forwardRef);
};

export * from './attachProps';
export * from './case';
