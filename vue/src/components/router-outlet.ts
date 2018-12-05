import { CreateElement } from 'vue';

export default {
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render(_: CreateElement, { props, children, parent, data }: any) {
    // used by devtools to display a router-view badge
    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    const h = parent.$createElement;
    const name = props.name;
    const route = parent.$route;
    const cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    let depth = 0;
    let inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children);
    }

    const matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h();
    }

    const component = (cache[name] = matched.components[name]);

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = (vm: any, val: any) => {
      // val could be undefined for unregistration
      const current = matched.instances[name];
      if ((val && current !== vm) || (!val && current === vm)) {
        matched.instances[name] = val;
      }
    };

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    (data.hook || (data.hook = {})).prepatch = (_: any, vnode: any) => {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    let propsToPass = (data.props = resolveProps(
      route,
      matched.props && matched.props[name]
    ));
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      const attrs = (data.attrs = data.attrs || {});
      for (const key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children);
  }
};
export function extend(a: any, b: any) {
  for (const key in b) {
    a[key] = b[key];
  }
  return a;
}
function resolveProps(route: any, config: any) {
  switch (typeof config) {
    case 'undefined':
      return;
    case 'object':
      return config;
    case 'function':
      return config(route);
    case 'boolean':
      return config ? route.params : undefined;
    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `props in "${route.path}" is a ${typeof config}, ` +
            `expecting an object, function or boolean.`
        );
      }
  }
}
