import React, { Component } from 'react';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface InternalProps extends React.HTMLAttributes<HTMLDivElement> {
  forwardedRef?: React.RefObject<HTMLDivElement>
};

type ExternalProps = Props & {
  ref?: React.RefObject<HTMLDivElement>
};

class IonPage extends Component<InternalProps> {

  constructor(props: InternalProps) {
    super(props);
  }

  render() {
    const { className, children, forwardedRef, ...rest } = this.props;
    return (
      <div
        className={className ? `ion-page ${className}` : 'ion-page'}
        ref={forwardedRef}
        {...rest}
      >
        {children}
      </div>
    )
  }
}

function forwardRef(props: InternalProps, ref: React.RefObject<HTMLDivElement>) {
  return <IonPage forwardedRef={ref} {...props}  />;
}
forwardRef.displayName = 'IonPage';

export default React.forwardRef<HTMLDivElement, ExternalProps>(forwardRef);
