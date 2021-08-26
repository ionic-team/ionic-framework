import React from 'react';

import type { StyleReactProps } from '../interfaces';

type Mutable<T> = { -readonly [P in keyof T]-?: T[P] }; // Remove readonly and ?

export type StencilReactExternalProps<PropType, ElementType> = PropType &
  Omit<React.HTMLAttributes<ElementType>, 'style'> &
  StyleReactProps;

// The comma in the type is to trick typescript because it things a single generic in a tsx file is jsx
export const mergeRefs = <ElementType,>(...refs: React.Ref<ElementType>[]) => (
  value: ElementType,
) =>
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref != null) {
      // This is typed as readonly so we need to allow for override
      (ref as Mutable<React.RefObject<ElementType>>).current = value;
    }
  });

export const createForwardRef = <PropType, ElementType>(
  ReactComponent: any,
  displayName: string,
) => {
  const forwardRef = (
    props: StencilReactExternalProps<PropType, ElementType>,
    ref: React.Ref<ElementType>,
  ) => {
    return <ReactComponent {...props} forwardedRef={ref} />;
  };
  forwardRef.displayName = displayName;

  return React.forwardRef(forwardRef);
};

export * from './attachProps';
export * from './case';
