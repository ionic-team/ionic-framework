import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, ErrorHandler, forwardRef, Input, Optional, NgZone, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Nav as INav } from '../../navigation/nav-interfaces';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { NavOptions } from '../../navigation/nav-util';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
import { ViewController } from '../../navigation/view-controller';
import { RootNode } from '../split-pane/split-pane';

/**
 * @name Nav
 * @description
 *
 * `ion-nav` is the declarative component for a [NavController](../../../navigation/NavController/).
 *
 * For more information on using nav controllers like Nav or [Tab](../../Tabs/Tab/),
 * take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 *
 * @usage
 * You must set a root page to be loaded initially by any Nav you create, using
 * the 'root' property:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { GettingStartedPage } from './getting-started';
 *
 * @Component({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 * })
 * class MyApp {
 *   root = GettingStartedPage;
 *
 *   constructor(){
 *   }
 * }
 * ```
 *
 * @demo /docs/demos/src/navigation/
 * @see {@link /docs/components#navigation Navigation Component Docs}
 */
@Component({
  selector: 'ion-nav',
  template:
    '<div #viewport nav-viewport></div>' +
    '<div class="nav-decor"></div>',
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: RootNode, useExisting: forwardRef(() => Nav) }]
})
export class Nav extends NavControllerBase implements AfterViewInit, RootNode, INav {

  private _root: any;
  private _hasInit: boolean = false;

  constructor(
    @Optional() viewCtrl: ViewController,
    @Optional() parent: NavController,
    app: App,
    config: Config,
    plt: Platform,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    cfr: ComponentFactoryResolver,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    @Optional() linker: DeepLinker,
    domCtrl: DomController,
    errHandler: ErrorHandler
  ) {
    super(parent, app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl, errHandler);

    if (viewCtrl) {
      // an ion-nav can also act as an ion-page within a parent ion-nav
      // this would happen when an ion-nav nests a child ion-nav.
      viewCtrl._setContent(this);
    }

    if (parent) {
      // this Nav has a parent Nav
      parent.registerChildNav(this);

    } else if (viewCtrl && viewCtrl.getNav()) {
      // this Nav was opened from a modal
      this.parent = viewCtrl.getNav();
      this.parent.registerChildNav(this);

    } else if (app && !app.getRootNav()) {
      // a root nav has not been registered yet with the app
      // this is the root navcontroller for the entire app
      app._setRootNav(this);
    }
  }

  /**
   * @hidden
   */
  @ViewChild('viewport', {read: ViewContainerRef})
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  ngAfterViewInit() {
    this._hasInit = true;

    let navSegment = this._linker.initNav(this);
    if (navSegment && (navSegment.component || navSegment.loadChildren)) {
      // there is a segment match in the linker
      return this._linker.initViews(navSegment).then(views => {
        this.setPages(views, null, null);
      });

    } else if (this._root) {
      // no segment match, so use the root property
      return this.push(this._root, this.rootParams, {
        isNavRoot: (<any>this._app.getRootNav() === this)
      }, null);
    }
  }

  goToRoot(opts: NavOptions) {
    return this.setRoot(this._root, this.rootParams, opts, null);
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
   * @input {object} Any nav-params to pass to the root page of this nav.
   */
  @Input() rootParams: any;

  /**
   * @hidden
   */
  ngOnDestroy() {
    this.destroy();
  }

  initPane(): boolean {
    const isMain = this._elementRef.nativeElement.hasAttribute('main');
    return isMain;
  }

  paneChanged(isPane: boolean) {
    if (isPane) {
      this.resize();
    }
  }

}
