import React from 'react';

import { NavContext } from '../contexts/NavContext';

import { IonicReactProps } from './IonicReactProps';
import { createForwardRef } from './utils';

interface IonPageProps extends IonicReactProps {
}

interface IonPageInternalProps extends IonPageProps {
  forwardedRef?: React.RefObject<HTMLDivElement>;
}

class IonPageInternal extends React.Component<IonPageInternalProps> {
  context!: React.ContextType<typeof NavContext>;
  ref: React.RefObject<HTMLDivElement>;

  constructor(props: IonPageInternalProps) {
    super(props);
    this.ref = this.props.forwardedRef || React.createRef();
  }

  componentDidMount() {
    if (this.context && this.ref && this.ref.current) {
      if (this.context.hasIonicRouter()) {
        this.context.registerIonPage(this.ref.current);
      }
    }
  }

  render() {
    const { className, children, forwardedRef, ...props } = this.props;

    return (
      <div className={className ? `ion-page ${className}` : 'ion-page'} ref={this.ref} {...props}>
        {children}
      </div>
    );
  }

  static get displayName() {
    return 'IonPage';
  }

  static get contextType() {
    return NavContext;
  }
}

export const IonPage = createForwardRef(IonPageInternal, 'IonPage');
