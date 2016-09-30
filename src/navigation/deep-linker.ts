import { Location } from '@angular/common';

import { App } from '../components/app/app';
import { convertToViews, isNav, isTab, isTabs, NavSegment, DIRECTION_BACK } from './nav-util';
import { isArray, isPresent } from '../util/util';
import { Nav } from '../components/nav/nav';
import { NavController } from './nav-controller';
import { Tab } from '../components/tabs/tab';
import { Tabs } from '../components/tabs/tabs';
import { UrlSerializer } from './url-serializer';
import { ViewController } from './view-controller';


/**
 * Deep Linking Scenarios:
 * 1) Initialize all NavControllers using the initial browser URL
 * 2) User clicks browser back button
 * 3) User clicks browser forward button
 * 4) User changes browser URL
 * 5) User clicks link href
 * 6) App uses NavController push/pop/setRoot/insert/remove
 *
 * Terms:
 * - URL: The string value found in the browser's URL bar
 * - Segment: Deep linker's data about each section between / in the URL
 * - Path: Deep linker's array of segments
 * - History: Deep linker's string array of internal URL history
 * - Location: Angular's Location provider, which abstracts Hash/Path Location Strategies
 */


/**
 * DeepLinker handles registering and displaying specific views based on URLs. It's used
 * underneath NavController so you'll never have to interact with it directly. When a new
 * view is push'ed with NavController, the URL is updated to match the path back to this
 * page.
 *
 * Unlike traditional web apps, URLs don't dictate navigation in Ionic apps.
 * Instead, URLs help us link to specific pieces of content as a breadcrumb.
 * We keep the current URL updated as we navigate, but we use the NavController's
 * push and pop, or navPush to move around. This makes it much easier
 * to handle the kinds of complicated nested navigation native apps are known for.
 *
 * We refer to our URL system as a Deep Link system instead of a Router to encourage
 * Ionic developers to think of URLs as a breadcrumb rather than as the source of
 * truth in navigation. This encourages flexible navigation design and happy apps all
 * over the world.
 */

/**
 * @private
 *
 */
export class DeepLinker {
  segments: NavSegment[] = [];
  history: string[] = [];
  indexAliasUrl: string;

  constructor(public app: App, public serializer: UrlSerializer, public location: Location) { }

  /**
   * @internal
   */
  init() {
    // scenario 1: Initial load of all navs from the initial browser URL
    const browserUrl = normalizeUrl(this.location.path());
    console.debug(`DeepLinker, init load: ${browserUrl}`);

    // update the Path from the browser URL
    this.segments = this.serializer.parse(browserUrl);

    // remember this URL in our internal history stack
    this.historyPush(browserUrl);

    // listen for browser URL changes
    this.location.subscribe((locationChg: { url: string }) => {
      this.urlChange(normalizeUrl(locationChg.url));
    });
  }

  /**
   * The browser's location has been updated somehow.
   * @internal
   */
  urlChange(browserUrl: string) {
    // do nothing if this url is the same as the current one
    if (!this.isCurrentUrl(browserUrl)) {

      if (this.isBackUrl(browserUrl)) {
        // scenario 2: user clicked the browser back button
        // scenario 4: user changed the browser URL to what was the back url was
        // scenario 5: user clicked a link href that was the back url
        console.debug(`DeepLinker, browser urlChange, back to: ${browserUrl}`);
        this.historyPop();

      } else {
        // scenario 3: user click forward button
        // scenario 4: user changed browser URL that wasn't the back url
        // scenario 5: user clicked a link href that wasn't the back url
        console.debug(`DeepLinker, browser urlChange, forward to: ${browserUrl}`);
        this.historyPush(browserUrl);
      }

      // get the app's root nav
      const appRootNav = <Nav>this.app.getRootNav();
      if (appRootNav) {
        if (browserUrl === '/') {
          // a url change to the index url
          if (isPresent(this.indexAliasUrl)) {
            // we already know the indexAliasUrl
            // update the url to use the know alias
            browserUrl = this.indexAliasUrl;

          } else {
            // the url change is to the root but we don't
            // already know the url used. So let's just
            // reset the root nav to its root page
            appRootNav.goToRoot({
              updateUrl: false,
              isNavRoot: true
            });
            return;
          }
        }

        // normal url
        this.segments = this.serializer.parse(browserUrl);
        this.loadNavFromPath(appRootNav);
      }
    }
  }

  /**
   * Update the deep linker using the NavController's current active view.
   * @internal
   */
  navChange(direction: string) {
    // all transitions completed
    if (direction) {
      // get the app's active nav, which is the lowest level one being viewed
      const activeNav = this.app.getActiveNav();
      if (activeNav) {

        // build up the segments of all the navs from the lowest level
        this.segments = this.pathFromNavs(activeNav);

        // build a string URL out of the Path
        const browserUrl = this.serializer.serialize(this.segments);

        // update the browser's location
        this.updateLocation(browserUrl, direction);
      }
    }
  }

  /**
   * @internal
   */
  updateLocation(browserUrl: string, direction: string) {
    if (this.indexAliasUrl === browserUrl) {
      browserUrl = '/';
    }

    if (direction === DIRECTION_BACK && this.isBackUrl(browserUrl)) {
      // this URL is exactly the same as the back URL
      // it's safe to use the browser's location.back()
      console.debug(`DeepLinker, location.back(), url: '${browserUrl}'`);
      this.historyPop();
      this.location.back();

    } else if (!this.isCurrentUrl(browserUrl)) {
      // probably navigating forward
      console.debug(`DeepLinker, location.go('${browserUrl}')`);
      this.historyPush(browserUrl);
      this.location.go(browserUrl);
    }
  }

  /**
   * @internal
   */
  getComponentFromName(componentName: any): any {
    const segment = this.serializer.createSegmentFromName(componentName);
    if (segment && segment.component) {
      return segment.component;
    }
    return null;
  }

  /**
   * @internal
   */
  createUrl(nav: any, nameOrComponent: any, data: any, prepareExternalUrl: boolean = true): string {
    // create a segment out of just the passed in name
    const segment = this.serializer.createSegmentFromName(nameOrComponent);
    if (segment) {
      const path = this.pathFromNavs(nav, segment.component, data);
      // serialize the segments into a browser URL
      // and prepare the URL with the location and return
      const url = this.serializer.serialize(path);
      return prepareExternalUrl ? this.location.prepareExternalUrl(url) : url;
    }
    return '';
  }

  /**
   * Build a browser URL out of this NavController. Climbs up the tree
   * of NavController's to create a string representation of all the
   * NavControllers state.
   *
   * @internal
   */
  pathFromNavs(nav: NavController, component?: any, data?: any): NavSegment[] {
    const segments: NavSegment[] = [];
    let view: ViewController;
    let segment: NavSegment;
    let tabSelector: string;

    // recursivly climb up the nav ancestors
    // and set each segment's data
    while (nav) {
      // this could be an ion-nav, ion-tab or ion-portal
      // if a component and data was already passed in then use it
      // otherwise get this nav's active view controller
      if (!component && isNav(nav)) {
        view = nav.getActive(true);
        if (view) {
          component = view.component;
          data = view.data;
        }
      }

      // the ion-nav or ion-portal has an active view
      // serialize the component and its data to a NavSegment
      segment = this.serializer.serializeComponent(component, data);

      // reset the component/data
      component = data = null;

      if (!segment) {
        break;
      }

      // add the segment to the path
      segments.push(segment);

      if (isTab(nav)) {
        // this nav is a Tab, which is a child of Tabs
        // add a segment to represent which Tab is the selected one
        tabSelector = this.getTabSelector(<any>nav);
        segments.push({
          id: tabSelector,
          name: tabSelector,
          component: null,
          data: null
        });

        // a parent to Tab is a Tabs
        // we should skip over any Tabs and go to the next parent
        nav = nav.parent && nav.parent.parent;

      } else {
        // this is an ion-nav
        // climb up to the next parent
        nav = nav.parent;
      }
    }

    // segments added from bottom to top, so Ti esrever dna ti pilf
    return segments.reverse();
  }

  /**
   * @internal
   */
  getTabSelector(tab: Tab): string {
    if (isPresent(tab.tabUrlPath)) {
      return tab.tabUrlPath;
    }
    if (isPresent(tab.tabTitle)) {
      return this.serializer.formatUrlPart(tab.tabTitle);
    }
    return `tab-${tab.index}`;
  }

  /**
   * @internal
   */
  getSelectedTabIndex(tabsNav: Tabs, pathName: string, fallbackIndex: number = 0): number {
    // we found a segment which probably represents which tab to select
    const indexMatch = pathName.match(/tab-(\d+)/);
    if (indexMatch) {
      // awesome, the segment name was something "tab-0", and
      // the numbe represents which tab to select
      return parseInt(indexMatch[1], 10);
    }

    // wasn't in the "tab-0" format so maybe it's using a word
    const tab = tabsNav._tabs.find(t => {
      return (isPresent(t.tabUrlPath) && t.tabUrlPath === pathName) ||
             (isPresent(t.tabTitle) && this.serializer.formatUrlPart(t.tabTitle) === pathName);
    });

    return isPresent(tab) ? tab.index : fallbackIndex;
  }

  /**
   * Each NavController will call this method when it initializes for
   * the first time. This allows each NavController to figure out
   * where it lives in the path and load up the correct component.
   * @internal
   */
  initNav(nav: any): NavSegment {
    const path = this.segments;

    if (nav && path.length) {
      if (!nav.parent) {
        // a nav without a parent is always the first nav segment
        path[0].navId = nav.id;
        return path[0];
      }

      for (var i = 1; i < path.length; i++) {
        if (path[i - 1].navId === nav.parent.id) {
          // this nav's parent segment is the one before this segment's index
          path[i].navId = nav.id;
          return path[i];
        }
      }
    }
    return null;
  }

  /**
   * @internal
   */
  initViews(segment: NavSegment): ViewController[] {
    let views: ViewController[];

    if (isArray(segment.defaultHistory)) {
      views = convertToViews(this, segment.defaultHistory);

    } else {
      views = [];
    }

    const view = new ViewController(segment.component, segment.data);
    view.id = segment.id;

    views.push(view);

    return views;
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
  loadNavFromPath(nav: NavController, done?: Function) {
    if (!nav) {
      done && done();

    } else {
      this.loadViewFromSegment(nav, () => {
        this.loadNavFromPath(nav.getActiveChildNav(), done);
      });
    }
  }

  /**
   * @internal
   */
  loadViewFromSegment(navInstance: any, done: Function) {
    // load up which nav ids belong to its nav segment
    let segment = this.initNav(navInstance);
    if (!segment) {
      done();
      return;
    }

    if (isTabs(navInstance)) {
      (<Tabs>navInstance).select(
        this.getSelectedTabIndex((<Tabs>navInstance), segment.name),
        {
          updateUrl: false,
          animate: false
        }
      );
      done();
      return;
    }

    let nav = <NavController>navInstance;

    // walk backwards to see if the exact view we want to show here
    // is already in the stack that we can just pop back to
    let view: ViewController;
    const count = nav.length() - 1;
    for (var i = count; i >= 0; i--) {
      view = nav.getByIndex(i);

      if (view && view.id === segment.id) {
        // hooray! we've already got a view loaded in the stack
        // matching the view they wanted to show
        if (i === count) {
          // this is the last view in the stack and it's the same
          // as the segment so there's no change needed
          done();

        } else {
          // it's not the exact view as the end
          // let's have this nav go back to this exact view
          nav.popTo(view, {
            animate: false,
            updateUrl: false,
          }, done);
        }
        return;
      }
    }

    // ok, so they must be pushing a new view to the stack
    // since we didn't find this same component already in the stack
    nav.push(segment.component, segment.data, {
      id: segment.id, animate: false, updateUrl: false
    }, done);
  }

  /**
   * @internal
   */
  isBackUrl(browserUrl: string) {
    return (browserUrl === this.history[this.history.length - 2]);
  }

  /**
   * @internal
   */
  isCurrentUrl(browserUrl: string) {
    return (browserUrl === this.history[this.history.length - 1]);
  }

  /**
   * @internal
   */
  historyPush(browserUrl: string) {
    if (!this.isCurrentUrl(browserUrl)) {
      this.history.push(browserUrl);
      if (this.history.length > 30) {
        this.history.shift();
      }
    }
  }

  /**
   * @internal
   */
  historyPop() {
    this.history.pop();
    if (!this.history.length) {
      this.historyPush(this.location.path());
    }
  }

}


export function setupDeepLinker(app: App, serializer: UrlSerializer, location: Location) {
  const deepLinker = new DeepLinker(app, serializer, location);
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
