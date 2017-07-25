import { Component, Prop, State } from '@stencil/core';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'ion-route'
})
export class Route {
  @Prop() url: string;

  @Prop() component: string;

  @Prop() componentProps: any = {};

  // The instance of the router
  @Prop() router: any;

  //@Prop() match: any;
  @State() match: any = {};

  ionViewWillLoad() {
/*
    this.routerInstance = document.querySelector(this.router)

    // HACK
    this.routerInstance.addEventListener('ionRouterNavigation', (e) => {
      this.match = e.detail;
    })
*/
  }

  render() {
/*
    this.match.url = this.routerInstance.$instance.routeMatch.url;
    const match = this.match
    const ChildComponent = this.component

    console.log('Does match match?', match.url, this.url)

    //return <p></p>;

    if(match.url == this.url) {
      console.log(`  <ion-route> Rendering route ${this.url}`, router, match);
      return (<ChildComponent props={this.componentProps} />);
    } else {
      return null;
    }
*/
  }
}
