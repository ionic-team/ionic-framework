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

  init() {
    let rootViewCtrl = this.activeViewController();
    if (rootViewCtrl) {
      let matchedRoute = this.match( this.getCurrentPath() ) || this.otherwise();
      this.push(rootViewCtrl, matchedRoute);
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

  push(viewCtrl, route) {
    let self = this;

    function run() {
      self._app.zone().run(() => {
        viewCtrl.push(route.cls);
      });
    }

    if (viewCtrl && route) {
      if (route.cls) {
        run();

      } else if (route.module) {
        System.import(route.module).then(m => {
          if (m) {
            route.cls = m[route.name];
            run();
          }
        });
      }
    }
  }

  stateChange(activeView) {
    if (activeView && activeView.ComponentType) {

      let routeConfig = activeView.ComponentType.route;
      if (routeConfig) {
        let matchedRoute = this.match(routeConfig.path);

        if (matchedRoute) {
          this.updateState(matchedRoute);
        }
      }
    }
  }

  updateState(route) {
    let newPath = route.path;
    if (window.location.hash !== '#' + newPath) {
      console.log('updateState', newPath);
      window.location.hash = newPath;
    }
  }

  addViewController(viewCtrl) {
    this._viewCtrls.push(viewCtrl);
  }

  activeViewController() {
    if (this._viewCtrls.length) {
      return this._viewCtrls[ this._viewCtrls.length - 1 ];
    }
    return null;
  }

  getCurrentPath() {
    let hash = window.location.hash;
    // Grab the path without the leading hash
    return hash.slice(1);
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
