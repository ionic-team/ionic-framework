import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';
import { NavContext } from './routing/NavContext';
import { IonBackButtonInner } from '../inner-proxies';

type BackButtonProps = LocalJSX.IonBackButton & {

};

export class IonBackButton extends React.Component<BackButtonProps> {
  context!: React.ContextType<typeof NavContext>;

  clickButton = (e: MouseEvent) => {
    if(this.context.hasIonicRouter()) {
      e.stopPropagation();
      this.context.goBack(this.props.defaultHref);
    } else {
      window.location.href = this.props.defaultHref;
    }
  }

  render() {
    return (
      <IonBackButtonInner onClick={this.clickButton} {...this.props}></IonBackButtonInner>
    );
  }
}

IonBackButton.contextType = NavContext;
