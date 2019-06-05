import { JSX as LocalJSX} from '@ionic/core';
import React, { Component } from 'react';
import { NavContext } from './NavContext';
import { IonBackButtonInner, } from '../index';

type BackButtonProps = LocalJSX.IonBackButtonAttributes & {

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
