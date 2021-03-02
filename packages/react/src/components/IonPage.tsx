import React from 'react';

import { NavContext } from '../contexts/NavContext';
import PageManager from '../routing/PageManager';

import { IonicReactProps } from './IonicReactProps';
import { createForwardRef } from './utils';

interface IonPageProps extends IonicReactProps {}

interface IonPageInternalProps extends IonPageProps {
  forwardedRef?: React.RefObject<HTMLDivElement>;
}

class IonPageInternal extends React.Component<IonPageInternalProps> {
  context!: React.ContextType<typeof NavContext>;

  constructor(props: IonPageInternalProps) {
    super(props);
  }

  render() {
    const { className, children, forwardedRef, ...props } = this.props;

    return this.context.hasIonicRouter() ? (
      <PageManager
        className={className ? `${className}` : ''}
        routeInfo={this.context.routeInfo}
        forwardedRef={forwardedRef}
        {...props}
      >
        {children}
      </PageManager>
    ) : (
      <div
        className={className ? `ion-page ${className}` : 'ion-page'}
        ref={forwardedRef}
        {...props}
      >
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
