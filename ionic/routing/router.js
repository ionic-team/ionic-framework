
export class Router {
  constructor() {
    this.routes = []
  }

  match() {
    let hash = window.location.hash;

    // Grab the path without the leading hash
    let path = hash.slice(1);

    let routeParams = {};

    for(let route of this.routes) {

      routeParams = route.match(path);

      if(routeParams !== false) {
        route.exec(this.buildRouteParams(routeParams));
        return
      }
    }

    return this.noMatch();
  }

  buildRouteParams(routeParams) {
    routeParams._route = {
      path: window.location.hash.slice(1)
    }
    return routeParams;
  }

  noMatch() {
    // otherwise()?
    return {}
  }

  on(path, cb) {
    let route = new Route(path, cb);
    this.routes.push(route);
    this.match();
    return route;
  }

  otherwise(path) {
    let routeParams = {}
    for(let route of this.routes) {
      if((routeParams = route.match(path)) !== false) {
        console.log('OTHERWISE: route matched:', route.url);
        route.exec(routeParams)
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

