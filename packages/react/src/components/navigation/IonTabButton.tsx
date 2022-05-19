import { JSX as LocalJSX } from '@ionic/core/components';
import React from 'react';

import { RouterOptions } from '../../models';
import { IonicReactProps } from '../IonicReactProps';
import { IonTabButtonInner } from '../inner-proxies';

type Props = LocalJSX.IonTabButton &
  IonicReactProps & {
    routerOptions?: RouterOptions;
    ref?: React.Ref<HTMLIonTabButtonElement>;
    onClick?: (e: any) => void;
  };

export const IonTabButton = /*@__PURE__*/ (() =>
  class extends React.Component<Props> {
    constructor(props: Props) {
      super(props);
      this.handleIonTabButtonClick = this.handleIonTabButtonClick.bind(this);
    }

    handleIonTabButtonClick() {
      if (this.props.onClick) {
        this.props.onClick(
          new CustomEvent('ionTabButtonClick', {
            detail: {
              tab: this.props.tab,
              href: this.props.href,
              routeOptions: this.props.routerOptions,
            },
          })
        );
      }
    }

    render() {
      /**
       * onClick is excluded from the props, since it has a custom
       * implementation within IonTabBar.tsx. Calling onClick within this
       * component would result in duplicate handler calls.
       */
      const { onClick, ...rest } = this.props;
      return (
        <IonTabButtonInner
          onIonTabButtonClick={this.handleIonTabButtonClick}
          {...rest}
        ></IonTabButtonInner>
      );
    }

    static get displayName() {
      return 'IonTabButton';
    }
  })();
