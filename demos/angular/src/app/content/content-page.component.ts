import { Component } from '@angular/core';

@Component({
  selector: 'app-card-page',
  styles: [
    `
      div.box {
        display: block;
        margin: 15px auto;
        max-width: 150px;
        height: 150px;
        background: blue;
      }

      div.box:last-of-type {
        background: yellow;
      }
    `
  ],
  template: `
  <ion-app>
  <ion-header #header>
    <ion-toolbar style="display: none" #toolbar>
      <ion-title>Hidden Toolbar</ion-title>
    </ion-toolbar>
    <ion-toolbar>
      <ion-title>Content - Basic</ion-title>
    </ion-toolbar>
  </ion-header>

    <ion-content padding style="text-align: center" #content>
      <p>
      <ion-button (click)="toggleFullscreen(content)">Toggle content.fullscreen</ion-button>
      <p>
        <ion-button (click)="toggleDisplay(header)" color="secondary">Toggle header</ion-button>
        <ion-button (click)="toggleDisplay(footer)" color="secondary">Toggle footer</ion-button>
        <ion-button (click)="toggleDisplay(toolbar)" color="secondary">Toggle 2nd toolbar</ion-button>
      </p>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </ion-content>


  <ion-footer #footer>
    <ion-toolbar>
      <ion-title>Footer</ion-title>
    </ion-toolbar>
  </ion-footer>
</ion-app>
  `
})
export class ContentPageComponent {
  constructor() {}

  toggleFullscreen(content) {
    content.fullscreen = !content.fullscreen;
    console.log('content.fullscren =', content.fullscreen);
  }

  toggleDisplay(el) {
    el.style.display = !el.style.display ? 'none' : null;
  }
}
