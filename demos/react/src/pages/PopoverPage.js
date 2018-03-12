import React, { Component } from 'react';

import PageThree from './PageThree';

export default class PopoverPage extends Component {

  constructor() {
    super();
    this.style = {
      height: '100%'
    };
    this.state = {
      content: 'popover page - ' + 50
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    setInterval(() => {
      this.setState({ content: 'Popover page - ' + Math.random() * 1000});
    }, 1000);
  }

  dismiss() {
    return this.props.popover.dismiss();
  }

  render() {
    return [
      <ion-header ref={(element) => this.element = element}>
        <ion-toolbar>
          <ion-title>Popover Page</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        Popover Page
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
