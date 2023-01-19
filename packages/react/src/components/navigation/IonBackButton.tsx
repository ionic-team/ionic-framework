import type { JSX as LocalJSX } from '@ionic/core/components';
import React from 'react';

import { NavContext } from '../../contexts/NavContext';
import type { IonicReactProps } from '../IonicReactProps';
import { IonBackButtonInner } from '../inner-proxies';

type Props = Omit<LocalJSX.IonBackButton, 'icon'> &
  IonicReactProps & {
    icon?:
      | {
          ios: string;
          md: string;
        }
      | string;
    ref?: React.Ref<HTMLIonBackButtonElement>;
  };

export const IonBackButton = /*@__PURE__*/ (() =>
  class extends React.Component<Props> {
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
  })();
