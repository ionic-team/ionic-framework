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

    handleIonTabButtonClick(ev: CustomEvent<any>, onClickFn: ((e: any) => void) | undefined) {
      if (onClickFn !== undefined) {
        /**
         * If the user provides an onClick function, we call it
         * with the original event. We execute this first,
         * so that the user has the chance to prevent the
         * default behavior.
         */
        onClickFn(ev);
      }
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
      const { onClick, ...rest } = this.props;
      return (
        <IonTabButtonInner
          onIonTabButtonClick={(ev) => this.handleIonTabButtonClick(ev, onClick)}
          {...rest}
        ></IonTabButtonInner>
      );
    }

    static get displayName() {
      return 'IonTabButton';
    }
  })();
