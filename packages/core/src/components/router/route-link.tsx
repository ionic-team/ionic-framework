import { Component, Prop } from '@stencil/core';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'ion-route-link'
})
export class RouteLink {
  @Prop() url: string;

  // The instance of the router
  @Prop() router: any;

  handleClick(e: any) {
    console.log('Route link click', e);
    /*
    router.navigateTo(this.url)
    */
  }

  render() {
    /*
    const router = document.querySelector(this.router);
    const match = router.match
    console.log(`  <ion-route-link> Rendering route ${this.url}`, router, match);

    return (
      <a onClick={this.handleClick.bind(this)}><slot></slot></a>
    );
    */
  }
}
