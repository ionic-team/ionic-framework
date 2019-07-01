import React from 'react';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

type InternalProps = Props & {
  forwardedRef?: React.RefObject<HTMLDivElement>
};

type ExternalProps = Props & {
  ref?: React.RefObject<HTMLDivElement>
};

const IonPageInternal: React.SFC<InternalProps> = ({ children, forwardedRef, className, ...props }) => (
  <div
    className={className ? `ion-page ${className}` : 'ion-page'}
    ref={forwardedRef}
    {...props}
  >
    {children}
  </div>
);

function forwardRef(props: InternalProps, ref: React.RefObject<HTMLDivElement>) {
  return <IonPageInternal {...props} forwardedRef={ref} />;
}
forwardRef.displayName = 'IonPage';

export const IonPage = /*@__PURE__*/React.forwardRef<HTMLDivElement, ExternalProps>(forwardRef);
