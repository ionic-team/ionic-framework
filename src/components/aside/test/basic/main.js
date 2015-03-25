import {ionicComponents} from 'ionic2/components';
import {Template, Component, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'aside-app'
})
@Template({
  directives: ionicComponents,
  inline: `<ion-aside-parent>
    <ion-aside side="left">
      LEFT
      <p>...</p>
      <p>...</p>
      <p>...</p>
      Side menu!
    </ion-aside>
    <ion-aside side="right">
      RIGHT
      <p>...</p>
      <p>...</p>
      <p>...</p>
      Side menu!
    </ion-aside>
    <ion-aside side="top">
      TOP
      <p>...</p>
      <p>...</p>
      <p>...</p>
      Side menu!
    </ion-aside>
    <ion-aside side="bottom">
      BOTTOM
      <p>...</p>
      <p>...</p>
      <p>...</p>
      Side menu!
    </ion-aside>
  </ion-aside-parent>
  <div class="content">
    <button class="button" (click)="openLeft()">
      Open Left Menu
    </button>
  </div>`
})
class AsideApp {
  openLeft() {
  }
}

bootstrap(AsideApp);
