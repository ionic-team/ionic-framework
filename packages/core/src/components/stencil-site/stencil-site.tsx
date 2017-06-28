import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'stencil-site'
})
export class App {
  constructor() {
  }
  render() {
    return (
      <div class="app">
        <ion-router id="router" root="/demos/stencil-site/">

          <site-header />

          <div style={{
            margin: '100px 0 0 0'
          }}>
            <ion-route url="/" router="#router" component="landing-page" />
            <ion-route url="/docs" router="#router" component="docs-page" />
            <ion-route url="/demos" router="#router" component="demos-page" />
          </div>

        </ion-router>
      </div>
    );
  }
}
