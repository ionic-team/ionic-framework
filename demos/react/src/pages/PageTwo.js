import React, { Component } from 'react';

import PageThree from './PageThree';

export default class PageTwo extends Component {

  constructor() {
    super();
    this.style = {
      height: '100%'
    };
    this.state = {
      content: 'page two - ' + 50
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ content: 'page two - ' + Math.random() * 1000});
    }, 1000);
  }

  goToNext() {
    const page = this.element.closest('.ion-page');
    const nav = page.closest('ion-nav');
    nav.push(PageThree, { paramOne: 'Michael Scott'});
  }

  goBack() {
    const page = this.element.closest('.ion-page');
    const nav = page.closest('ion-nav');
    nav.pop();
  }

  render() {
    return [
      <ion-header ref={(element) => this.element = element}>
        <ion-toolbar>
          <ion-title>Page Two</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        Page Two
        <div>
          <ion-button onClick={() => this.goToNext()}>Go to Page Three</ion-button>
        </div>
        <div>
          <ion-button onClick={() => this.goBack()}>Go Back</ion-button>
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
