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

  constructor(props: IonPageInternalProps) {
    super(props);
  }

  render() {
    const { className, children, forwardedRef, ...props } = this.props;

    const PageManager = this.context.getPageManager();

    return (
      this.context.hasIonicRouter() ? (
        <PageManager className={className} routeInfo={this.context.routeInfo} {...props}>
          {children}
        </PageManager>
      ) : (
      <div className={className ? `ion-page ${className}` : 'ion-page'} {...props}>
        {children}
      </div>
      )
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
