import { Components } from '@ionic/core';
import React, { Component } from 'react';
import { NavContext } from './NavContext';
import { IonBackButtonInner, } from '../index';

type BackButtonProps = Components.IonBackButtonAttributes & {
  goBack: () => void;
};

export class IonBackButton extends Component<BackButtonProps> {
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
