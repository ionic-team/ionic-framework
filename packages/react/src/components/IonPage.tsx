import React from 'react';

import { NavContext } from '../contexts/NavContext';

import { ReactProps } from './ReactProps';

export const IonPage = /*@__PURE__*/(() => class IonPageInternal extends React.Component<React.HTMLAttributes<HTMLElement> & ReactProps> {
  context!: React.ContextType<typeof NavContext>;
  ref = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (this.context && this.ref.current) {
      if (this.context.hasIonicRouter()) {
        this.context.registerIonPage(this.ref.current);
      }
    }
  }

  render() {
    const { className, children, ...props } = this.props;

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
})();
