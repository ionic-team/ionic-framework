/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class RouterSegments {
    constructor(path) {
        this.path = path;
    }
    next() {
        if (this.path.length > 0) {
            return this.path.shift();
        }
        return '';
    }
}
function writeNavState(root, chain, index, direction) {
    if (index >= chain.length) {
        return Promise.resolve();
    }
    const route = chain[index];
    const node = breadthFirstSearch(root);
    if (!node) {
        return Promise.resolve();
    }
    return node.componentOnReady()
        .then(() => node.setRouteId(route.id, route.props, direction))
        .then(changed => {
        if (changed) {
            direction = 0;
        }
        const nextEl = node.getContentElement();
        if (nextEl) {
            return writeNavState(nextEl, chain, index + 1, direction);
        }
        return null;
    });
}
function readNavState(node) {
    const stack = [];
    let pivot;
    while (true) {
        pivot = breadthFirstSearch(node);
        if (pivot) {
            const cmp = pivot.getRouteId();
            if (cmp) {
                node = pivot.getContentElement();
                stack.push(cmp.toLowerCase());
            }
            else {
                break;
            }
        }
        else {
            break;
        }
    }
    return {
        stack: stack,
        pivot: pivot,
    };
}
function matchPath(stack, routes) {
    const path = [];
    for (const id of stack) {
        const route = routes.find(r => r.id === id);
        if (route) {
            path.push(...route.path);
            routes = route.subroutes;
        }
        else {
            break;
        }
    }
    return {
        path: path,
        routes: routes,
    };
}
function matchRouteChain(path, routes) {
    const chain = [];
    const segments = new RouterSegments(path);
    while (routes.length > 0) {
        const route = matchRoute(segments, routes);
        if (!route) {
            break;
        }
        chain.push(route);
        routes = route.subroutes;
    }
    return chain;
}
function matchRoute(segments, routes) {
    if (!routes) {
        return null;
    }
    let index = 0;
    let selectedRoute = null;
    let ambiguous = false;
    let segment;
    let l;
    while (true) {
        routes = routes.filter(r => r.path.length > index);
        if (routes.length === 0) {
            break;
        }
        segment = segments.next();
        routes = routes.filter(r => r.path[index] === segment);
        l = routes.length;
        if (l === 0) {
            selectedRoute = null;
            ambiguous = false;
        }
        else {
            selectedRoute = routes[0];
            ambiguous = l > 1;
        }
        index++;
    }
    if (ambiguous) {
        throw new Error('ambiguious match');
    }
    return selectedRoute;
}
function readRoutes(root) {
    return Array.from(root.children)
        .filter(el => el.tagName === 'ION-ROUTE')
        .map(el => ({
        path: parsePath(el.path),
        id: el.sel,
        props: el.props,
        subroutes: readRoutes(el)
    }));
}
function generatePath(segments) {
    const path = segments
        .filter(s => s.length > 0)
        .join('/');
    return '/' + path;
}
function parsePath(path) {
    if (path === null || path === undefined) {
        return [''];
    }
    const segments = path.split('/')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    if (segments.length === 0) {
        return [''];
    }
    else {
        return segments;
    }
}
const navs = ['ION-NAV', 'ION-TABS'];
function breadthFirstSearch(root) {
    if (!root) {
        console.error('search root is null');
        return null;
    }
    // we do a Breadth-first search
    // Breadth-first search (BFS) is an algorithm for traversing or searching tree
    // or graph data structures.It starts at the tree root(or some arbitrary node of a graph,
    // sometimes referred to as a 'search key'[1]) and explores the neighbor nodes
    // first, before moving to the next level neighbours.
    const queue = [root];
    let node;
    while (node = queue.shift()) {
        // visit node
        if (navs.indexOf(node.tagName) >= 0) {
            return node;
        }
        // queue children
        const children = node.children;
        for (let i = 0; i < children.length; i++) {
            queue.push(children[i]);
        }
    }
    return null;
}
function writePath(history, base, usePath, path, isPop, state) {
    path = [base, ...path];
    let url = generatePath(path);
    if (usePath) {
        url = '#' + url;
    }
    state++;
    if (isPop) {
        history.back();
        history.replaceState(state, null, url);
    }
    else {
        history.pushState(state, null, url);
    }
    return state;
}
function readPath(loc, base, useHash) {
    const path = useHash
        ? loc.hash.substr(1)
        : loc.pathname;
    if (path.startsWith(base)) {
        return parsePath(path.slice(base.length));
    }
    return null;
}

class Router {
    constructor() {
        this.busy = false;
        this.state = 0;
        this.base = '';
        this.useHash = true;
    }
    componentDidLoad() {
        // read config
        this.routes = readRoutes(this.el);
        // perform first write
        this.dom.raf(() => {
            console.debug('[OUT] page load -> write nav state');
            this.writeNavStateRoot();
        });
    }
    onPopState() {
        if (window.history.state === null) {
            this.state++;
            window.history.replaceState(this.state, document.title, document.location.href);
        }
        if (!this.busy) {
            console.debug('[OUT] hash changed -> write nav state');
            this.writeNavStateRoot();
        }
    }
    onNavChanged(ev) {
        if (this.busy) {
            return;
        }
        console.debug('[IN] nav changed -> update URL');
        const { stack, pivot } = this.readNavState();
        const { path, routes } = matchPath(stack, this.routes);
        if (pivot) {
            // readNavState() found a pivot that is not initialized
            console.debug('[IN] pivot uninitialized -> write partial nav state');
            this.writeNavState(pivot, [], routes, 0);
        }
        const isPop = ev.detail.isPop === true;
        this.writePath(path, isPop);
    }
    writeNavStateRoot() {
        const node = document.querySelector('ion-app');
        const currentPath = this.readPath();
        const direction = window.history.state >= this.state ? 1 : -1;
        if (currentPath) {
            return this.writeNavState(node, currentPath, this.routes, direction);
        }
        return Promise.resolve();
    }
    writeNavState(node, path, routes, direction) {
        const chain = matchRouteChain(path, routes);
        this.busy = true;
        return writeNavState(node, chain, 0, direction)
            .catch(err => console.error(err))
            .then(() => this.busy = false);
    }
    readNavState() {
        const root = document.querySelector('ion-app');
        return readNavState(root);
    }
    writePath(path, isPop) {
        this.state = writePath(window.history, this.base, this.useHash, path, isPop, this.state);
    }
    readPath() {
        return readPath(window.location, this.base, this.useHash);
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-router"; }
    static get properties() { return { "base": { "type": String, "attr": "base" }, "config": { "context": "config" }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "useHash": { "type": Boolean, "attr": "use-hash" } }; }
}

export { Router as IonRouter };
