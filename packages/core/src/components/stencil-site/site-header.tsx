import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'site-header',
  styleUrl: 'site-header.scss'
})
export class SiteHeader {
  render() {
    return (
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-grid>
            <ion-row>
              <ion-col>
                <img src="logo.png" />
              </ion-col>
              <ion-col>
                <ion-route-link router="#router" url="">Home</ion-route-link>
                <ion-route-link router="#router" url="docs">Docs</ion-route-link>
                <ion-route-link router="#router" url="demos">Demos</ion-route-link>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-toolbar>
      </ion-header>
    )
  }
}
