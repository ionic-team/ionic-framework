import React, { Component } from 'react';

import PageThree from './PageThree';

export default class ModalPage extends Component {

  constructor() {
    super();
    this.style = {
      height: '100%'
    };
    this.state = {
      content: 'modal page - ' + 50
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    setInterval(() => {
      this.setState({ content: 'Modal page - ' + Math.random() * 1000});
    }, 1000);
  }

  dismiss() {
    return this.props.modal.dismiss();
  }

  render() {
    return [
      <ion-header ref={(element) => this.element = element}>
        <ion-toolbar>
          <ion-title>Modal Page</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        Modal Page
        <div>
          <ion-button onClick={() => this.dismiss()}>Dismiss</ion-button>
        </div>
        <div>
          Some random content: {this.state.content}
        </div>
        <div>
          Props : {this.props.paramOne}
        </div>
      </ion-content>
    ];
  }
}
