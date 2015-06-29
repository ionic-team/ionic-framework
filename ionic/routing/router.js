import * as util from '../util/util';


export class IonicRouter {
  constructor(config) {
    this._routes = [];
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

  addRoute(name, routeConfig) {
    if (name && routeConfig && routeConfig.path) {
      let route = new IonicRoute(name, routeConfig);
      this._routes.push(route);
    }
  }

  init() {
    let rootViewCtrl = this.activeViewController();
    if (rootViewCtrl) {
      let matchedRoute = this.match() || this.otherwise();
      this.push(rootViewCtrl, matchedRoute);
    }
  }

  match() {
    let path = this.getCurrentPath();
    let route = null;

    for (let i = 0, ii = this._routes.length; i < ii; i++) {
      route = this._routes[i];
      if (route.match(path)) {
        return route;
      }
    }
  }

  otherwise(val) {
    if (arguments.length) {
      this._otherwise = val;
    } else {
      let route = null;
      for (let i = 0, ii = this._routes.length; i < ii; i++) {
        route = this._routes[i];
        if (route.name === this._otherwise) {
          return route;
        }
      }
    }
  }

  push(viewCtrl, route) {
    let self = this;

    function run() {
      self._app.zone().run(() => {
        viewCtrl.push(route.cls).then(() => {
          self.updateState(route);
        });
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

  updateState(activeRoute) {
    console.log('updateState', activeRoute);

    window.location.hash = activeRoute.path;
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
    let path = hash.slice(1);
    return path;
  }

}


export class IonicRoute {
  constructor(name, routeConfig) {
    this.name = name;
    this.cls = null;
    util.extend(this, routeConfig);
  }

  match(path) {
    if (this.path) {
      if (this.path == path) {
        return true;
      }
    }
    return false;
  }

}





/**
 * The RouterController handles checking for matches of
 * each registered route, and triggering callbacks, gathering
 * route param data, etc.
 */
export class RouterController {
  constructor() {
    this.routes = []
  }

  // Build route params to send to the matching route.
  _buildRouteParams(routeParams) {
    routeParams._route = {
      path: window.location.hash.slice(1)
    }
    return routeParams;
  }

  // Called when there is no match
  _noMatch() {
    // otherwise()?
    return {}
  }

  setNavController(navController) {
    this.rootNavController = navController;
    console.log('Root nav controller set', navController);
    this.run();
  }

  getCurrentPath() {
    let hash = window.location.hash;

    // Grab the path without the leading hash
    let path = hash.slice(1);
    return path;
  }

  push(componentClass, params) {
    // if(!this.rootNavController) {
    //   console.error('Router: No root nav controller to push matching route.');
    //   return;
    // }
    // console.log('Router pushing', componentClass, params);
    // setTimeout(() => {
    //   this.rootNavController.push(componentClass, params);
    // });
  }

  run() {
    this.match();
  }

  /**
   * Try to match a single route.
   */
  matchOne(route) {
    console.log('Match one', route);
    let path = this.getCurrentPath();
    let routeParams = route.match(path);

    if(routeParams !== false) {
      route.exec(this._buildRouteParams(routeParams));

      // If the route has a registered URL and isn't set to quiet mode,
      // emit the new URL into the address bar
      if(route.url && !route.quiet) {
        this.emit(route.url);
      }

      return
    }
  }

  /**
   * Check the current hash/location for a match with
   * registered routes. If a match is found, execute the
   * first one and then return.
   */
  match() {
    let path = this.getCurrentPath();

    let routeParams = {};

    for(let route of this.routes) {

      routeParams = route.match(path);

      if(routeParams !== false) {
        route.exec(this._buildRouteParams(routeParams));

        /*
        // If the route has a registered URL and isn't set to quiet mode,
        // emit the new URL into the address bar
        if(route.url && !route.quiet) {
          this.emit(route.url);
        }
        */

        return
      }
    }

    return this._noMatch();
  }

  /**
   * Emit the current path to the address bar, either
   * as part of the hash or pop/push state if using
   * html5 routing style.
   */
  emit(path) {
    window.location.hash = path
  }

  /**
   * Register a new route.
   * @param path the path to watch for
   * @param cb the callback to execute
   */
  on(path, cb) {
    let route = new Route(path, cb);
    this.routes.push(route);
    //this.matchOne(route);
    return route;
  }


  /**
   * If no routes match, trigger the one that matches
   * the "otherwise" condition.
   */
  otherwise(path) {
    let routeParams = {}
    for(let route of this.routes) {
      if((routeParams = route.match(path)) !== false) {
        console.log('OTHERWISE: route matched:', route.url);
        route.exec(routeParams)
        this.emit(route.url)
      }
    }
  }
}

export class Route {
  constructor(url, handler) {
    this.url = url;
    this.handler = handler;
  }
  match(path) {
    let routeParams = {}

    // Either we have a direct string match, or
    // we need to check the route more deeply
    // Example: /tab/home
    if(this.url == path) {
      return {}
    } else if((routeParams = this._matchParams(path))) {
      return routeParams
    }
    return false
  }

  _matchParams(path) {
    var parts = path.split('/');
    var routeParts = this.url.split('/');

    // Our aggregated route params that matched our route path.
    // This is used for things like /post/:id
    var routeParams = {};

    if(parts.length !== routeParts.length) {
      // Can't possibly match if the lengths are different
      return false;
    }

    // Otherwise, we need to check each part

    let rp, pp;
    for(let i in parts) {
      pp = parts[i];
      rp = routeParts[i];

      if(rp[0] == ':') {
        // We have a route param, store it in our
        // route params without the colon
        routeParams[rp.slice(1)] = pp;
      } else if(pp !== rp) {
        return false;
      }

    }
    return routeParams;
  }
  exec(matchParams) {
    this.handler(matchParams)
  }
}

/**
 * Routable is metadata added to routable things in Ionic.
 * This makes it easy to auto emit URLs for routables pushed
 * onto the stack.
 */
export class Routable {
  constructor(componentClass, routeInfo) {
    this.componentClass = componentClass;
    this.routeInfo = routeInfo;

    //console.log('New routable', componentClass, routeInfo);
    Router_OLD.on(this.routeInfo.url, (routeParams) => {
      console.log('Routable matched', routeParams, this.componentClass);
      Router_OLD.push(this.componentClass, routeParams);
    });

    componentClass.router = this;
  }
  invoke(componentInstance) {
    // Called on viewLoaded
    this.componentInstance = componentInstance;

    // Bind some lifecycle events
    componentInstance._viewWillEnter.observer({
      next: () => {
        Router_OLD.emit(this.routeInfo.url);
      }
    });

    return this;
  }

}

export var Router_OLD = new RouterController();

//export { IonicRouter, Router_OLD, Route, Routable };
