import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';

import { IonicReactProps } from '../IonicReactProps';
import { IonTabButtonInner } from '../inner-proxies';

type Props = LocalJSX.IonTabButton & IonicReactProps & {
  routeOptions?: unknown;
  ref?: React.RefObject<HTMLIonTabButtonElement>;
  onClick?: (e: any) => void;
};

export class IonTabButton extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.handleIonTabButtonClick = this.handleIonTabButtonClick.bind(this);
  }

  handleIonTabButtonClick() {
    if (this.props.onClick) {
      this.props.onClick(new CustomEvent('ionTabButtonClick', {
        detail: { tab: this.props.tab, href: this.props.href, routeOptions: this.props.routeOptions }
      }));
    }
  }

  render() {
    const { onClick, ...rest } = this.props;
    return (
      <IonTabButtonInner onIonTabButtonClick={this.handleIonTabButtonClick} {...rest}></IonTabButtonInner>
    );
  }

  static get displayName() {
    return 'IonTabButton';
  }
}
