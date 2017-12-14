import React, { Component } from 'react';

import { createModal } from '@ionic/react';

import PageTwo from './PageTwo';
import ModalPage from './ModalPage';

export default class PageOne extends Component {

  constructor() {
    super();
    this.style = {
      height: '100%'
    };
    this.state = {
      content: 50
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave')
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave')
  }

  goToPageTwo() {
    const nav = this.element.closest('ion-nav');
    nav.push(PageTwo, { paramOne: 'Tobey Flenderson'});
  }

  openModal() {
    return createModal({
      component: ModalPage
    }).then((modal) => {
      return modal.present();
    });
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ content: Math.random() * 1000});
    }, 1000);

  }

  render() {
    return [
      <ion-header ref={(element) => this.element = element}>
        <ion-toolbar>
          <ion-title>Page One</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        Page One
        <div>
          <ion-button onClick={() => this.goToPageTwo()}>Go to Page Two</ion-button>
        </div>
        <div>
          <ion-button onClick={() => this.openModal()}>OpenModal</ion-button>
        </div>
        <div>
          Some random content: {this.state.content}
        </div>
      </ion-content>
    ];
  }
}
