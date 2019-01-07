import React, { Component } from 'react';
import { IonBackButton } from '../index';
import { Components } from '@ionic/core';
import { withRouter, RouteComponentProps } from 'react-router';


type Props = RouteComponentProps & Components.IonBackButtonAttributes;

type State = {}

class IonStackBackButton extends Component<Props, State> {
  render() {
    return (
      <IonBackButton {...this.props}></IonBackButton>
    );
  }
}

export default withRouter(IonStackBackButton);
