import {
  RegExp,
  RegExpWrapper,
  RegExpMatcherWrapper,
  StringWrapper,
  isPresent,
  isBlank,
  BaseException,
  normalizeBlank
} from 'angular2/src/facade/lang';

import * as util from '../util/util';
import {PathRecognizer} from './path-recognizer';


export class IonicRouter {
  constructor(config) {
    this._routes = {};
    this._viewCtrls = [];
    this.config(config);
  }

  app(app) {
    this._app = app;
  }

  config(config) {
    for (let routeName in config) {
      this.addRoute(routeName, config[routeName]);
    }
  }

  addRoute(routeName, routeConfig) {
    if (routeName && routeConfig && routeConfig.path) {
      this._routes[routeName] = new Route(routeName, routeConfig)
    }
  }

  init(window) {
    this.initHistory(window);
    this.loadByPath(this.getCurrentPath(), this.otherwise());
  }

  initHistory(window) {
    this.location = window.location;
    this.history = window.history;

    window.addEventListener('popstate', ev => {
      this.onPopState(ev);
    });
  }

  loadByPath(path, fallbackRoute) {
    let self = this;
    let activeViewCtrl = self.activeViewController();
    let matchedRoute = self.match(path) || fallbackRoute;

    function zoneLoad() {
      self._app.zone().run(() => {
        activeViewCtrl.push(matchedRoute.cls);
        self._lastPath = matchedRoute.path;
      });
    }

    if (activeViewCtrl && matchedRoute) {

      if (matchedRoute.cls) {
        zoneLoad();

      } else if (matchedRoute.module) {
        System.import(matchedRoute.module).then(m => {
          if (m) {
            matchedRoute.cls = m[matchedRoute.name];
            zoneLoad();
          }
        });
      }
    }
  }

  onPopState(ev) {
    let newState = ev.state || {};
    let newStatePath = newState.path;
    let newStateBackPath = newState.backPath;
    let newStateForwardPath = newState.forwardPath;
    let lastLoadedStatePath = this._lastPath;

    if (newStatePath === lastLoadedStatePath) {
      // do nothing if the last path is the same
      // as the "new" current state
      return;
    }

    let activeViewCtrl = this.activeViewController();
    if (activeViewCtrl) {

      if (newStateForwardPath === lastLoadedStatePath) {
        // if the last loaded state path is the same as the new
        // state's forward path then the user is moving back
        activeViewCtrl.pop();

      } else if (newStateBackPath === lastLoadedStatePath) {
        // if the last loaded state path is the new state's
        // back path, then the user is moving forward
        this.loadByPath(newStatePath);
      }

    }
  }

  stateChange(type, activeView) {
    if (activeView && activeView.ComponentType) {

      let routeConfig = activeView.ComponentType.route;
      if (routeConfig) {
        let matchedRoute = this.match(routeConfig.path);

        if (matchedRoute) {

          if (type == 'pop') {
            // if the popstate came from the browser's back button (and not Ionic)
            // then we shouldn't force another browser history.back()
            // only do a history.back() if the URL hasn't been updated yet
            if (this.isNewPath(matchedRoute.path)) {
              this.history.back();
            }

          } else {
            this.pushState(matchedRoute);
          }

          this._lastPath = matchedRoute.path;
        }
      }
    }
  }

  pushState(route) {
    let enteringState = {
      path: route.path,
      backPath: this._lastPath,
      forwardPath: null
    };

    if (this._hasInit) {
      // update the leaving state to know what it's forward state will be
      let leavingState = util.extend(this.history.state, {
        forwardPath: enteringState.path
      });
      if (leavingState.path !== enteringState.path) {
        this.history.replaceState(leavingState, '', '#' + leavingState.path);
      }

      if (this.isNewPath(route.path)) {
        // push the new state to the history stack since the path
        // isn't already in the location hash
        this.history.pushState(enteringState, '', '#' + enteringState.path);
      }

    } else {
      // replace the very first load with the correct entering state info
      this.history.replaceState(enteringState, '', '#' + enteringState.path);
      this._hasInit = true;
    }
  }

  match(path) {
    let matchedRoute = null;
    let routeMatch = null;
    let highestSpecifity = 0;

    for (let routeName in this._routes) {
      routeMatch = this._routes[routeName].match(path);

      if (routeMatch.match && (!matchedRoute || routeMatch.specificity > highestSpecifity)) {
        matchedRoute = this._routes[routeName];
        highestSpecifity = routeMatch.specificity;
      }
    }
    return matchedRoute;
  }

  otherwise(val) {
    if (arguments.length) {
      this._otherwise = val;

    } else if (this._otherwise) {
      return this._routes[this._otherwise];
    }
  }

  addViewController(viewCtrl) {
    this._viewCtrls.push(viewCtrl);
  }

  activeViewController() {
    if (this._viewCtrls.length) {
      return this._viewCtrls[ this._viewCtrls.length - 1 ];
    }
  }

  getCurrentPath() {
    let hash = this.location.hash;
    // Grab the path without the leading hash
    return hash.slice(1);
  }

  isNewPath(path) {
    return (this.location.hash !== ('#' + path));
  }

}


export class Routable {
  constructor(cls, routeConfig) {
    cls.route = routeConfig;
  }
}


class Route {
  constructor(name, routeConfig) {
    this.name = name;
    this.cls = null;
    util.extend(this, routeConfig);
    this.recognizer = new PathRecognizer(this.path);
  }

  match(matchPath) {
    let routeMatch = new RouteMatch(this, matchPath);
    if (routeMatch) {
      return routeMatch;
    }
    return false;
  }

}

class RouteMatch {
  constructor(route, matchPath) {
    this.route = route;
    this.specificity = route.recognizer.specificity;
    this.match = RegExpWrapper.firstMatch(route.recognizer.regex, matchPath);
  }
}
