import { JSX as LocalJSX } from '@ionic/core';
import React from 'react';
import { NavContext } from './NavContext';
import { IonBackButtonInner } from '../proxies';

type BackButtonProps = LocalJSX.IonBackButton & {

};

export class IonBackButton extends React.Component<BackButtonProps> {
  context!: React.ContextType<typeof NavContext>;

  clickButton = (e: MouseEvent) => {
    e.stopPropagation();
    this.context.goBack(this.props.defaultHref);
  }

  render() {
    return (
      <IonBackButtonInner onClick={this.clickButton} {...this.props}></IonBackButtonInner>
    );
  }
}

IonBackButton.contextType = NavContext;
