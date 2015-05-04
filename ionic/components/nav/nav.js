import {
  Component,
  View as NgView,
  If,
  For,
  NgElement,
  Query,
  QueryList,
  Descendants
} from 'angular2/angular2';
import {NavBase} from 'ionic/components/nav/nav-base';
import {NavItem, NavItemDynamicComponent} from 'ionic/components/nav/nav-item';
import {ToolbarContainer} from 'ionic/components/toolbar/toolbar';

/**
 * We need a way for children to get ahold of the instantiated `Nav`.
 * Until angular supports components adding themselves to the Injector,
 * Nav is going to add an instance of a "NavInjectable" class to the injector.
 * This NavInjectable will have a pointer to the Nav class on `this.nav`.
 * Now descendant components (only our private ones) will have access to NavInjectable,
 * and be able to get access to the Nav through `navInjectable.nav` (@see navItem)
 */
export class NavInjectable {}

@Component({
  selector: 'ion-nav',
  properties: {
    initial: 'initial'
  },
  injectables: [
    // Add NavInjectable to the injector for this and all descendants
    NavInjectable
  ]
})
@NgView({
  template: `
  <header class="toolbar-container" [class.hide]="getToolbars('top').length == 0">
    <div *for="#toolbar of getToolbars('top')" [toolbar-create]="toolbar"></div>
  </header>
  <section class="nav-item-container">
    <div class="nav-item"
         *for="#item of _ngNavItems"
         [item]="item"></div>
  </section>
  <footer class="toolbar-container" [class.hide]="getToolbars('bottom').length == 0">
    <div *for="#toolbar of getToolbars('bottom')" [toolbar-create]="toolbar"></div>
  </footer>
  `,
  directives: [NavItem, For, If, ToolbarContainer]
})
export class Nav extends NavBase {
  constructor(
    element: NgElement,
    navInjectable: NavInjectable
  ) {
    super(element);
    // Add the nav to navInjectable.
    navInjectable.nav = this;
  }
}
