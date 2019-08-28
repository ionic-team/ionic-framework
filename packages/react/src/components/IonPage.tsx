import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';

import { NavContext } from '..';

import { ReactProps } from './ReactProps';
import { IonPageInner } from './inner-proxies';

export const IonPage = /*@__PURE__*/(() => class IonPageInternal extends React.Component<LocalJSX.IonPage & ReactProps> {
  context!: React.ContextType<typeof NavContext>;
  ref = React.createRef<HTMLIonPageElement>();

  componentDidMount() {
    if (this.context && this.ref.current) {
      this.context.registerIonPage(this.ref.current);
    }
  }

  render() {
    const { children } = this.props;
    return (
      <IonPageInner ref={this.ref}>
        {this.ref && children}
      </IonPageInner>
    );
  }

  static get displayName() {
    return 'IonPage';
  }

  static get contextType() {
    return NavContext;
  }
})();
