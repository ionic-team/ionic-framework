import {RegExpWrapper} from 'angular2/src/facade/lang';

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
    if (config) {
      for (let routeName in config) {
        this.addRoute(routeName, config[routeName]);
      }
    }
  }

  addRoute(routeName, routeConfig) {
    if (routeName && routeConfig && routeConfig.path) {
      this._routes[routeName] = new Route(routeName, routeConfig);
      if (routeConfig.root) {
        this.otherwise(routeName);
      }
    }
  }

  load(ionicApp, ionicConfig, window) {
    // create each of the state manager classes
    for (let name in stateManagerClasses) {
      stateManagers[name] = new stateManagerClasses[name](this, ionicApp, ionicConfig, window);
    }
    stateManagerClasses = {};

    this.loadByPath(this.getCurrentPath(), this.otherwise());
  }

  loadByPath(path, fallbackRoute) {
    let self = this;
    let activeViewCtrl = self.activeViewController();
    let matchedRoute = self.match(path) || fallbackRoute;

    function zoneLoad() {
      self._app.zone().run(() => {
        activeViewCtrl.push(matchedRoute.cls);
        self.lastPath(matchedRoute.path);
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

  getCurrentPath() {
    // check each of the state managers and the one with the
    // highest priority wins of knowing what path we are currently at
    let rtnPath = null;
    let highestPriority = -1;
    let currentState = null;

    for (let name in stateManagers) {
      currentState = stateManagers[name].getCurrentPath();
      if (currentState.path && currentState.priority > highestPriority) {
        rtnPath = currentState.path;
      }
    }

    return rtnPath;
  }

  stateChange(type, activeView) {
    if (activeView && activeView.cls) {

      let routeConfig = activeView.cls.route;
      if (routeConfig) {
        let matchedRoute = this.match(routeConfig.path);

        if (matchedRoute) {

          for (let name in stateManagers) {
            stateManagers[name].stateChange(matchedRoute.path, type, activeView);
          }

          this.lastPath(matchedRoute.path);
        }
      }
    }
  }

  lastPath(val) {
    if (arguments.length) {
      this._lastPath = val;
    }
    return this._lastPath;
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

  static registerStateManager(name, StateManagerClass) {
    stateManagerClasses[name] = StateManagerClass;
  }

  static deregisterStateManager(name) {
    delete stateManagerClasses[name];
    delete stateManagers[name];
  }

}

let stateManagerClasses = {};
let stateManagers = {};


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
