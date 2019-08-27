import React from 'react';

import { createForwardRef } from './utils';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

type InternalProps = Props & {
  forwardedRef?: React.Ref<HTMLDivElement>
};

type ExternalProps = Props & {
  ref?: React.Ref<HTMLDivElement>
};

const IonPageInternal: React.FC<InternalProps> = ({ children, forwardedRef, className, ...props }) => (
  <div
    className={className !== undefined ? `ion-page ${className}` : 'ion-page'}
    ref={forwardedRef}
    {...props}
  >
    {children}
  </div>
);

export const IonPage = /*@__PURE__*/createForwardRef<ExternalProps, HTMLDivElement>(IonPageInternal, 'IonPage');
