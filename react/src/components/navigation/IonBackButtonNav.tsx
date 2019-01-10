import React, { Component } from 'react';
import { IonBackButton } from '../index';
import { Components } from '@ionic/core';


type Props = Components.IonBackButtonAttributes & {
  goBack: () => void;
};

export default class IonBackButtonNav extends Component<Props> {

  clickButton = (e: MouseEvent) => {
    e.stopPropagation();
    this.props.goBack();
  }

  render() {
    return (
      <IonBackButton onClick={this.clickButton} {...this.props}></IonBackButton>
    );
  }
}
