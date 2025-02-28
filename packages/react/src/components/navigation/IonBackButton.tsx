import type { JSX as LocalJSX } from '@ionic/core/components';
import React, { type PropsWithChildren } from 'react';

import { NavContext } from '../../contexts/NavContext';
import type { IonicReactProps } from '../IonicReactProps';
import { IonBackButtonInner } from '../inner-proxies';

type Props = PropsWithChildren<
  LocalJSX.IonBackButton &
    IonicReactProps & {
      ref?: React.Ref<HTMLIonBackButtonElement>;
    }
>;

export class IonBackButton extends React.Component<Props> {
  context!: React.ContextType<typeof NavContext>;

  clickButton = (e: React.MouseEvent) => {
    /**
     * If ion-back-button is being used inside
     * of ion-nav then we should not interact with
     * the router.
     */
    if (e.target && (e.target as HTMLElement).closest('ion-nav') !== null) {
      return;
    }

    const { defaultHref, routerAnimation } = this.props;

    if (this.context.hasIonicRouter()) {
      e.stopPropagation();
      this.context.goBack(defaultHref, routerAnimation);
    } else if (defaultHref !== undefined) {
      window.location.href = defaultHref;
    }
  };

  render() {
    return <IonBackButtonInner onClick={this.clickButton} {...this.props}></IonBackButtonInner>;
  }

  static get displayName() {
    return 'IonBackButton';
  }

  static get contextType() {
    return NavContext;
  }

  shouldComponentUpdate(): boolean {
    return true;
  }
}
