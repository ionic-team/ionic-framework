import { ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { Location } from '@angular/common';

import { App } from '../components/app/app';
import { DIRECTION_BACK, NavLink, NavSegment, TransitionDoneFn, convertToViews, isNav, isTab, isTabs } from './nav-util';
import { ModuleLoader } from '../util/module-loader';
import { isArray, isPresent } from '../util/util';
import { Tab, Tabs } from './nav-interfaces';
import { NavigationContainer } from './navigation-container';
import { NavController } from './nav-controller';
import { UrlSerializer, formatUrlPart } from './url-serializer';
import { ViewController } from './view-controller';

/**
 * @hidden
 */
export class DeepLinker {

  /** @internal */
  _history: string[] = [];
  /** @internal */
  _indexAliasUrl: string;


  constructor(
    public _app: App,
    public _serializer: UrlSerializer,
    public _location: Location,
    public _moduleLoader: ModuleLoader,
    public _baseCfr: ComponentFactoryResolver
  ) {}

  /**
   * @internal
   */
  init() {
    // scenario 1: Initial load of all navs from the initial browser URL
    const browserUrl = normalizeUrl(this._location.path());
    console.debug(`DeepLinker, init load: ${browserUrl}`);

    // remember this URL in our internal history stack
    this._historyPush(browserUrl);

    // listen for browser URL changes
    this._location.subscribe((locationChg: { url: string }) => {
      this._urlChange(normalizeUrl(locationChg.url));
    });
  }

  /**
   * The browser's location has been updated somehow.
   * @internal
   */
  _urlChange(browserUrl: string) {
    // do nothing if this url is the same as the current one
    if (!this._isCurrentUrl(browserUrl)) {
      let isGoingBack = true;
      if (this._isBackUrl(browserUrl)) {
        // scenario 2: user clicked the browser back button
        // scenario 4: user changed the browser URL to what was the back url was
        // scenario 5: user clicked a link href that was the back url
        console.debug(`DeepLinker, browser urlChange, back to: ${browserUrl}`);
        this._historyPop();

      } else {
        // scenario 3: user click forward button
        // scenario 4: user changed browser URL that wasn't the back url
        // scenario 5: user clicked a link href that wasn't the back url
        isGoingBack = false;
        console.debug(`DeepLinker, browser urlChange, forward to: ${browserUrl}`);
        this._historyPush(browserUrl);
      }

      // get the app's root nav container
      const activeNavContainers = this._app.getActiveNavContainers();
      if (activeNavContainers && activeNavContainers.length) {
        if (browserUrl === '/') {
          // a url change to the index url
          if (isPresent(this._indexAliasUrl)) {
            // we already know the indexAliasUrl
            // update the url to use the know alias
            browserUrl = this._indexAliasUrl;

          } else {
            // the url change is to the root but we don't
            // already know the url used. So let's just
            // reset the root nav to its root page
            activeNavContainers.forEach((navContainer: NavController) => {
              navContainer.goToRoot({
                updateUrl: false,
                isNavRoot: true
              });
            });
            return;
          }
        }

        // normal url
        const segments = this.getCurrentSegments(browserUrl);
        segments
          .map(segment => {
            // find the matching nav container
            for (const navContainer of activeNavContainers) {
              const nav = getNavFromTree(navContainer, segment.navId);
              if (nav) {
                return {
                  segment: segment,
                  navContainer: nav
                };
              }
            }
          })
          .filter(pair => !!pair)
          .forEach(pair => {
            this._loadViewForSegment(pair.navContainer, pair.segment, () => {});
          });
      }
    }
  }

  getCurrentSegments(browserUrl?: string) {
    if (!browserUrl) {
      browserUrl = normalizeUrl(this._location.path());
    }
    return this._serializer.parse(browserUrl);
  }

  /**
   * Update the deep linker using the NavController's current active view.
   * @internal
   */
  navChange(direction: string) {
    if (direction) {
      const activeNavContainers = this._app.getActiveNavContainers();
      // the only time you'll ever get a TABS here is when loading directly from a URL
      // this method will be called again when the TAB is loaded
      // so just don't worry about the TABS for now
      // if you encounter a TABS, just return
      for (const activeNavContainer of activeNavContainers) {
        if (isTabs(activeNavContainer) || (activeNavContainer as NavController).isTransitioning()) {
          return;
        }
      }

      // okay, get the root navs and build the segments up
      let segments: NavSegment[] = [];
      const navContainers: NavigationContainer[] = this._app.getRootNavs();
      for (const navContainer of navContainers) {
        const segmentsForNav = this.getSegmentsFromNav(navContainer);
         segments = segments.concat(segmentsForNav);
      }
      segments = segments.filter(segment => !!segment);
      if (segments.length) {
        const browserUrl = this._serializer.serialize(segments);
        this._updateLocation(browserUrl, direction);
      }
    }
  }

  getSegmentsFromNav(nav: NavigationContainer): NavSegment[] {
    let segments: NavSegment[] = [];
    if (isNav(nav)) {
      segments.push(this.getSegmentFromNav(nav as NavController));
    } else if (isTab(nav)) {
      segments.push(this.getSegmentFromTab(nav));
    }
    nav.getActiveChildNavs().forEach(child => {
      segments = segments.concat(this.getSegmentsFromNav(child));
    });
    return segments;
  }

  getSegmentFromNav(nav: NavController, component?: any, data?: any): NavSegment {
     if (!component) {
      const viewController = nav.getActive(true);
      if (viewController) {
        component = viewController.component;
        data = viewController.data;
      }
    }
    return this._serializer.serializeComponent(nav, component, data);
  }

  getSegmentFromTab(navContainer: NavigationContainer, component?: any, data?: any): NavSegment {
    if (navContainer && navContainer.parent) {
      const tabsNavContainer = navContainer.parent as NavigationContainer;
      const activeChildNavs = tabsNavContainer.getActiveChildNavs();
      if (activeChildNavs && activeChildNavs.length) {
        const activeChildNav = activeChildNavs[0];
        const viewController = (activeChildNav as NavController).getActive(true);
        if (viewController) {
          component = viewController.component;
          data = viewController.data;
        }
        return this._serializer.serializeComponent(tabsNavContainer, component, data);
      }
    }
  }

  /**
   * @internal
   */
  _updateLocation(browserUrl: string, direction: string) {
    if (this._indexAliasUrl === browserUrl) {
      browserUrl = '/';
    }

    if (direction === DIRECTION_BACK && this._isBackUrl(browserUrl)) {
      // this URL is exactly the same as the back URL
      // it's safe to use the browser's location.back()
      console.debug(`DeepLinker, location.back(), url: '${browserUrl}'`);
      this._historyPop();
      this._location.back();

    } else if (!this._isCurrentUrl(browserUrl)) {
      // probably navigating forward
      console.debug(`DeepLinker, location.go('${browserUrl}')`);
      this._historyPush(browserUrl);
      this._location.go(browserUrl);
    }
  }


  getComponentFromName(componentName: string): Promise<any> {
    const link = this._serializer.getLinkFromName(componentName);
    if (link) {
      // cool, we found the right link for this component name
      return this.getNavLinkComponent(link);
    }

    // umm, idk
    return Promise.reject(`invalid link: ${componentName}`);
  }


  getNavLinkComponent(link: NavLink) {
    if (link.component) {
      // sweet, we're already got a component loaded for this link
      return Promise.resolve(link.component);
    }

    if (link.loadChildren) {
      // awesome, looks like we'll lazy load this component
      // using loadChildren as the URL to request
      return this._moduleLoader.load(link.loadChildren).then((response) => {
        link.component = response.component;
        return response.component;
      });
    }

    return Promise.reject(`invalid link component: ${link.name}`);
  }


  /**
   * @internal
   */
  resolveComponent(component: any): ComponentFactory<any> {

    let cfr = this._moduleLoader.getComponentFactoryResolver(component);
    if (!cfr) {
      cfr = this._baseCfr;
    }
    return cfr.resolveComponentFactory(component);
  }

  /**
   * @internal
   */
  createUrl(navContainer: NavigationContainer, nameOrComponent: any, _data: any, prepareExternalUrl: boolean = true): string {
    // create a segment out of just the passed in name
    const segment = this._serializer.createSegmentFromName(navContainer, nameOrComponent);
    const allSegments = this.getCurrentSegments();
    if (segment) {
      for (let i = 0; i < allSegments.length; i++) {
        if (allSegments[i].navId === navContainer.name || allSegments[i].navId === navContainer.id) {
          allSegments[i] = segment;
          const url = this._serializer.serialize(allSegments);
          return prepareExternalUrl ? this._location.prepareExternalUrl(url) : url;
        }
      }
    }
    return '';
  }

  /**
   * Each NavController will call this method when it initializes for
   * the first time. This allows each NavController to figure out
   * where it lives in the path and load up the correct component.
   * @internal
   */
  getSegmentByNavIdOrName(navId: string, name: string): NavSegment {
    const browserUrl = normalizeUrl(this._location.path());
    const segments = this._serializer.parse(browserUrl);
    for (const segment of segments) {
      if (segment.navId === navId || segment.navId === name) {
        return segment;
      }
    }
    return null;
  }

  /**
   * @internal
   */
  initViews(segment: NavSegment) {
    const link = this._serializer.getLinkFromName(segment.name);
    return this.getNavLinkComponent(link).then((component: any) => {
      segment.component = component;
      const view = new ViewController(component, segment.data);
      view.id = segment.id;

      if (isArray(segment.defaultHistory)) {
        return convertToViews(this, segment.defaultHistory).then(views => {
          views.push(view);
          return views;
        });
      }

      return [view];
    });
  }

  /**
   * @internal
   */
  _isBackUrl(browserUrl: string) {
    return (browserUrl === this._history[this._history.length - 2]);
  }

  /**
   * @internal
   */
  _isCurrentUrl(browserUrl: string) {
    return (browserUrl === this._history[this._history.length - 1]);
  }

  /**
   * @internal
   */
  _historyPush(browserUrl: string) {
    if (!this._isCurrentUrl(browserUrl)) {
      this._history.push(browserUrl);
      if (this._history.length > 30) {
        this._history.shift();
      }
    }
  }

  /**
   * @internal
   */
  _historyPop() {
    this._history.pop();
    if (!this._history.length) {
      this._historyPush(this._location.path());
    }
  }

  /**
   * @internal
   */
  _getTabSelector(tab: Tab): string {
    if (isPresent(tab.tabUrlPath)) {
      return tab.tabUrlPath;
    }
    if (isPresent(tab.tabTitle)) {
      return formatUrlPart(tab.tabTitle);
    }
    return `tab-${tab.index}`;
  }

  /**
   * Using the known Path of Segments, walk down all descendents
   * from the root NavController and load each NavController according
   * to each Segment. This is usually called after a browser URL and
   * Path changes and needs to update all NavControllers to match
   * the new browser URL. Because the URL is already known, it will
   * not update the browser's URL when transitions have completed.
   *
   * @internal
   */
  _loadViewForSegment(navContainer: NavigationContainer, segment: NavSegment, done: TransitionDoneFn) {
    if (!segment) {
      return done(false, false);
    }

    if (isTabs(navContainer) || (isTab(navContainer) && navContainer.parent)) {
      const tabs = <Tabs> <any> (isTabs(navContainer) ? navContainer : navContainer.parent);
      const selectedIndex = tabs._getSelectedTabIndex(segment.secondaryId);
      const tab = tabs.getByIndex(selectedIndex);
      tab._segment = segment;
      tabs.select(tab, {
        updateUrl: false,
        animate: false
      }, true);
      return done(false, false);
    }

    const navController = <NavController> <any> navContainer;
    const numViews = navController.length() - 1;
    // walk backwards to see if the exact view we want to show here
    // is already in the stack that we can just pop back to
    for (let i = numViews; i >= 0; i--) {
      const viewController = navController.getByIndex(i);
      if (viewController && (viewController.id === segment.id || viewController.id === segment.name)) {
        // hooray! we've already got a view loaded in the stack
        // matching the view they wanted to show
        if (i === numViews) {
          // this is the last view in the stack and it's the same
          // as the segment so there's no change needed
          return done(false, false);
        } else {
          // it's not the exact view as the end
          // let's have this nav go back to this exact view
          return navController.popTo(viewController, {
            animate: false,
            updateUrl: false,
          }, done);
        }
      }
    }

    // ok, so we don't know about a view that they're navigating to
    // so we might as well just call setRoot and make tthe view the first view
    // this seems like the least bad option
    return navController.setRoot(segment.component || segment.name, segment.data, {
      id: segment.id, animate: false, updateUrl: false
    }, done);

  }

}


export function setupDeepLinker(app: App, serializer: UrlSerializer, location: Location, moduleLoader: ModuleLoader, cfr: ComponentFactoryResolver) {
  const deepLinker = new DeepLinker(app, serializer, location, moduleLoader, cfr);
  deepLinker.init();
  return deepLinker;
}


export function normalizeUrl(browserUrl: string): string {
  browserUrl = browserUrl.trim();
  if (browserUrl.charAt(0) !== '/') {
    // ensure first char is a /
    browserUrl = '/' + browserUrl;
  }
  if (browserUrl.length > 1 && browserUrl.charAt(browserUrl.length - 1) === '/') {
    // ensure last char is not a /
    browserUrl = browserUrl.substr(0, browserUrl.length - 1);
  }
  return browserUrl;
}

export function getNavFromTree(nav: NavigationContainer, id: string) {
  while (nav) {
    if (nav.id === id || nav.name === id) {
      return nav;
    }
    nav = nav.parent;
  }
  return null;
}
