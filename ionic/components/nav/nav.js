import {
  Component,
  View as NgView,
  For,
  NgElement,
} from 'angular2/angular2';
import {NavControllerBase} from 'ionic/components/nav/nav-controller';
import {NavItem} from 'ionic/components/nav/nav-item';
import {Toolbar} from 'ionic/components/toolbar/toolbar';

@Component({
  selector: 'ion-nav',
  properties: {
    initial: 'initial'
  }
})
@NgView({
  template: `
  <header class="toolbar-container">
    <ion-toolbar class="view-toolbar">
      <ion-nav-title>
        Test Nonfunctional Toolbar
      </ion-nav-title>
    </ion-toolbar>
    <!-- COLLECTION OF TOOLBARS FOR EACH OF ITS VIEWS WITHIN THIS NAV-VIEWPORT -->
    <!-- TOOLBARS FOR EACH VIEW SHOULD HAVE THE SAME CONTEXT AS ITS VIEW -->
  </header>

  <div class="nav-item-container">
    <!-- COLLECTION OF PANES WITHIN THIS NAV-VIEWPORT, EACH PANE AS ONE VIEW -->
    <!-- EACH VIEW HAS A TOOLBAR WHICH NEEDS TO HAVE THE SAME CONTEXT -->
    <ion-nav-item class="nav-pane" *for="#item of _ngForLoopArray" [item]="item"></section>
  </div>
  `,
  directives: [NavItem, For, Toolbar]
})
export class Nav extends NavControllerBase {
  constructor(
    element: NgElement
  ) {
    super(element);
  }
}
