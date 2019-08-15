import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';

import { NavContext } from '../../contexts/NavContext';
import { IonBackButtonInner } from '../inner-proxies';

type Props = LocalJSX.IonBackButton & {
  ref?: React.RefObject<HTMLIonBackButtonElement>;
};

export const IonBackButton = /*@__PURE__*/(() => class extends React.Component<Props> {
  context!: React.ContextType<typeof NavContext>;

  clickButton = (e: MouseEvent) => {
    const defaultHref = this.props.defaultHref;
    if (defaultHref !== undefined) {
      if (this.context.hasIonicRouter()) {
        e.stopPropagation();
        this.context.goBack(defaultHref);
      } else {
        window.location.href = defaultHref;
      }
    }
  }

  render() {
    return (
      <IonBackButtonInner onClick={this.clickButton} {...this.props}></IonBackButtonInner>
    );
  }

  static get displayName() {
    return 'IonBackButton';
  }

  static get contextType() {
    return NavContext;
  }
})();
