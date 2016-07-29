import { AfterViewInit, Component, ComponentResolver, ElementRef, Input, Optional, NgZone, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Keyboard } from '../../util/keyboard';
import { GestureController } from '../../gestures/gesture-controller';
import { isTrueProperty } from '../../util/util';
import { NavControllerBase } from './nav-controller-base';
import { ViewController } from './view-controller';

/**
 * @name Nav
 * @description
 *
 * `ion-nav` is the declarative component for a [NavController](../NavController/).
 *
 * For more information on using nav controllers like Nav or [Tab](../../Tabs/Tab/),
 * take a look at the [NavController API Docs](../NavController/).
 *
 *
 * @usage
 * You must set a root page to be loaded initially by any Nav you create, using
 * the 'root' property:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { ionicBootstrap } from 'ionic-angular';
 * import { GettingStartedPage } from './getting-started';
 *
 * @Component({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 * })
 * class MyApp {
 *   private root: any = GettingStartedPage;
 *
 *   constructor(){
 *   }
 * }
 *
 * ionicBootstrap(MyApp);
 * ```
 *
 *
 * @demo /docs/v2/demos/navigation/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 */
@Component({
  selector: 'ion-nav',
  template: `
    <div #viewport nav-viewport></div>
    <div class="nav-decor"></div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class Nav extends NavControllerBase implements AfterViewInit {
  private _root: any;
  private _hasInit: boolean = false;

  constructor(
    @Optional() viewCtrl: ViewController,
    @Optional() parent: NavControllerBase,
    app: App,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    compiler: ComponentResolver,
    gestureCtrl: GestureController
  ) {
    super(parent, app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl);

    if (viewCtrl) {
      // an ion-nav can also act as an ion-page within a parent ion-nav
      // this would happen when an ion-nav nests a child ion-nav.
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(elementRef);
    }

    if (parent) {
      // this Nav has a parent Nav
      parent.registerChildNav(this);

    } else if (app) {
      // this is the root navcontroller for the entire app
      this._app.setRootNav(this);
    }
  }

  /**
   * @private
   */
  @ViewChild('viewport', {read: ViewContainerRef})
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    this._hasInit = true;

    if (this._root) {
      this.push(this._root);
    }
  }

  /**
   * @input {Page} The Page component to load as the root page within this nav.
   */
  @Input()
  get root(): any {
    return this._root;
  }
  set root(page: any) {
    this._root = page;

    if (this._hasInit) {
      this.setRoot(page);
    }
  }

  /**
   * @input {boolean} Whether it's possible to swipe-to-go-back on this nav controller or not.
   */
  @Input()
  get swipeBackEnabled(): boolean {
    return this._sbEnabled;
  }
  set swipeBackEnabled(val: boolean) {
    this._sbEnabled = isTrueProperty(val);
  }

}
