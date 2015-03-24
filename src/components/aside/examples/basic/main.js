import {Aside, AsideParent} from 'ionic2/components/aside/aside';
import {Template, Component, bootstrap} from 'angular2/angular2';


@Component({
  selector: 'aside-app'
})
@Template({
  // Inlined version of main.html
  inline: `
  <ion-aside-parent>
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
  </div>
  `,
  directives: [Aside, AsideParent]
})
class AsideApp {
  constructor() {
  }
  openLeft() {
  }
}

bootstrap(AsideApp);
