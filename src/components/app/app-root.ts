import { AfterViewInit, Component, ComponentFactoryResolver, HostBinding, Inject, OpaqueToken, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { App } from './app';
import { Config } from '../../config/config';
import { FeatureDetect } from '../../util/feature-detect';
import { Platform } from '../../platform/platform';

export const UserRoot = new OpaqueToken('USERROOT');


/**
 * @private
 */
@Component({
  selector: 'ion-app',
  template: `
    <div #anchor nav-portal></div>
    <click-block></click-block>
  `
})
export class AppRoot implements AfterViewInit {

  @ViewChild('anchor', {read: ViewContainerRef}) _viewport: ViewContainerRef;

  constructor(
    @Inject(UserRoot) private _userCmp: any,
    private _cfr: ComponentFactoryResolver,
    private _renderer: Renderer,
    app: App,
    config: Config,
    platform: Platform,
    featureDetect: FeatureDetect
  ) {
    app.appRoot = this;

    const doc = <Document>document;
    const body = <HTMLBodyElement>doc.body;
    const mode = config.get('mode');

    // touch devices should not use :hover CSS pseudo
    // enable :hover CSS when the "hoverCSS" setting is not false
    if (config.getBoolean('hoverCSS', true)) {
      // DOM WRITE
      body.classList.add('enable-hover');
    }

    // set the mode class name
    // ios/md/wp
    // DOM WRITE
    body.classList.add(mode);

    // language and direction
    // DOM WRITE
    platform.setDir(doc.documentElement.dir, false);
    // DOM WRITE
    platform.setLang(doc.documentElement.lang, false);

    const versions = platform.versions();
    platform.platforms().forEach(platformName => {
      // platform-ios
      let platformClass = 'platform-' + platformName;
      // DOM WRITE
      body.classList.add(platformClass);

      let platformVersion = versions[platformName];
      if (platformVersion) {
        // platform-ios9
        platformClass += platformVersion.major;
        // DOM WRITE
        body.classList.add(platformClass);

        // platform-ios9_3
        // DOM WRITE
        body.classList.add(platformClass + '_' + platformVersion.minor);
      }
    });

    // DOM WRITE
    featureDetect.write(window, doc);

    // DOM READ
    featureDetect.read(window, document);

    // DOM WRITE
    featureDetect.results(window, document);
  }

  ngAfterViewInit() {
    // load the user app's root component
    const factory = this._cfr.resolveComponentFactory(this._userCmp);

    // DOM WRITE
    const componentRef = this._viewport.createComponent(factory);

    // DOM WRITE
    componentRef.changeDetectorRef.detectChanges();
  }

  @HostBinding('class.disable-scroll') disableScroll: boolean = false;

}
