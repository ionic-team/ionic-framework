import {RegExpWrapper} from 'angular2/src/facade/lang';

import * as util from '../util/util';
import {PathRecognizer} from './path-recognizer';


export class IonicRouter {
  constructor(config) {
    this._routes = [];
    this._viewCtrls = [];
    this.config(config);
  }

  app(app) {
    this.app = app;
  }

  config(config) {
    if (config) {
      for (let i = 0; i < config.length; i++) {
        this.addRoute(config[i]);
      }
    }
  }

  addRoute(routeConfig) {
    if (routeConfig && routeConfig.path && routeConfig.component) {
      let route = new Route(routeConfig);
      if (routeConfig.root) {
        this.otherwise(route);
      }
      this._routes.push(route);
    }
  }

  stateChange(type, activeView) {
    // this fires when the app's state has changed stateChange will
    // tell each of the state managers that the state has changed, and
    // each state manager will decide what to do with this info
    // (the url state manager updates the url bar if a route was setup)
    if (activeView && activeView.component) {

      let componentRoute = activeView.component.route;
      if (componentRoute) {
        let path = componentRoute.generate(activeView.params);
        if (path) {
          for (let name in stateManagers) {
            stateManagers[name].stateChange(path, type, activeView);
          }
        }
      }

    }
  }

  matchPaths(paths) {
    // load each of paths to a component
    let components = [];
    let route;

    if (paths) {
      for (let i = 0; i < paths.length; i++) {
        route = this.matchPath(paths[i]);
        if (route && route.component) {
          components.push(route.component);
        }
      }
    }

    return components;
  }

  matchPath(path) {
    // takes a string path and loops through each of the setup
    // routes to see if the path matches any of the routes
    // the matched path with the highest specifity wins
    let matchedRoute = null;
    let route = null;
    let routeMatch = null;

    for (let i = 0; i < this._routes.length; i++) {
      route = this._routes[i];
      routeMatch = route.match(path);

      if (routeMatch && (!matchedRoute || route.specificity > matchedRoute.specificity)) {
        matchedRoute = route;
      }
    }
    return matchedRoute;
  }

  load(window, ionicApp, ionicConfig) {
    // load is called when the app has finished loading each state
    // manager gets a chance to say what path the app should be at
    let viewCtrl = this.viewController();
    if (!viewCtrl || !this._routes.length) {
      return Promise.resolve();
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // get the initial load paths from the state manager with the highest priorty
    this.getManagerPaths(window, ionicApp, ionicConfig).then(paths => {

      // load all of the paths the highest priority state manager has given
      let components = this.matchPaths(paths);

      if (!components.length && this.otherwise()) {
        // the state manager did not find and loaded components
        // use the "otherwise" path
        components = [this.otherwise().component];
      }

      this.app.zoneRun(() => {
        viewCtrl.setItems(components).then(resolve);
      });
    });

    return promise;
  }

  getManagerPaths(window, ionicApp, ionicConfig) {
    // loop through all of the state managers and load their paths
    // the state manager with valid paths and highest priority wins
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // load each of the state managers
    let stateManagerPromises = [];
    for (let name in stateManagerClasses) {
      stateManagers[name] = new stateManagerClasses[name](window, this, ionicApp, ionicConfig);
      stateManagerPromises.push( stateManagers[name].load() );
    }

    // when all the state manager loads have resolved then see which one wins
    Promise.all(stateManagerPromises).then(stateManagerLoadResults => {

      // now that all the state managers are loaded
      // get the highest priority state manager's paths
      let stateLoadResult = null;
      let paths = null;
      let highestPriority = -1;

      for (let i = 0; i < stateManagerLoadResults.length; i++) {
        stateLoadResult = stateManagerLoadResults[i];
        if (stateLoadResult && stateLoadResult.paths.length && stateLoadResult.priority > highestPriority) {
          paths = stateLoadResult.paths;
          highestPriority = stateLoadResult.priority;
        }
      }

      resolve(paths);
    });

    return promise;
  }

  push(path) {
    let viewCtrl = this.viewController();
    if (viewCtrl) {
      let matchedRoute = this.matchPath(path);
      if (matchedRoute && matchedRoute.component) {
        this.app.zoneRun(() => {
          viewCtrl.push(matchedRoute.component, matchedRoute.params, {});
        });
      }
    }
  }

  pop() {
    let viewCtrl = this.viewController();
    if (viewCtrl) {
      this.app.zoneRun(() => {
        viewCtrl.pop();
      });
    }
  }

  otherwise(val) {
    if (arguments.length) {
      this._otherwise = val;
    }
    return this._otherwise
  }

  addViewController(viewCtrl) {
    this._viewCtrls.push(viewCtrl);
  }

  viewController() {
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


class Route {
  constructor(routeConfig) {
    util.extend(this, routeConfig);
    this.recognizer = new PathRecognizer(this.path);
    this.specificity = this.recognizer.specificity;

    this.component.route = this;
  }

  match(path) {
    return RegExpWrapper.firstMatch(this.recognizer.regex, path);
  }

  generate(params) {
    return this.recognizer.generate(params);
  }

}
