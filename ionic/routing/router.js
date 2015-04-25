
export class Router {
  constructor() {
    this.routes = []
  }

  match() {
    let hash = window.location.hash;

    // Grab the path without the leading hash
    let path = hash.slice(1);

    let routeParams = {};
    let found = false

    for(let route of this.routes) {
      // Either we have a direct string match, or 
      // we need to check the route more deeply
      // Example: /tab/home
      if(route.url == path) {
        found = true
      } else if((routeParams = this.matchRoute(route, path))) {
        found = true;
      }

      if(found) {
        route.exec(this.buildRouteParams(routeParams));
        return
      }
    }

    return this.noMatch();
  }

  // Check a specific route against a given path
  matchRoute(route, path) {
    var parts = path.split('/');
    var routeParts = route.url.split('/');

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
}

export class Route {
  constructor(url, handler) {
    this.url = url;
    this.handler = handler;
  }
  exec(matchParams) {
    this.handler(matchParams)
  }
}

