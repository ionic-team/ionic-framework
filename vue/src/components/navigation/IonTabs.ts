import Vue, { CreateElement, RenderContext, VNode } from 'vue';
import { Route } from 'vue-router';

interface EventListeners {
  [key: string]: Function | Function[];
}

const tabBars = [] as VNode[];
const cachedTabs = [] as VNode[];

export default {
  name: 'IonTabs',
  functional: true,
  render(h: CreateElement, { parent, data, slots, listeners }: RenderContext) {
    const renderQueue = [] as VNode[];
    const postRenderQueue = [] as VNode[];
    const route = parent.$route;
    let selectedTab = '';

    if (!parent.$router) {
      throw new Error('IonTabs requires an instance of either VueRouter or IonicVueRouter');
    }

    // Loop through all of the children in the default slot
    for (let i = 0; i < slots().default.length; i++) {
      const vnode = slots().default[i];

      // Not an ion-tab, push to render and post-render processing queues
      if (!vnode.tag || vnode.tag.match(/ion-tab$/) === null) {
        renderQueue.push(vnode);
        postRenderQueue[i] = vnode;
        continue;
      }

      const tabName = matchRouteToTab(vnode, route);
      const tabIsCached = cachedTabs[i];

      // Landed on tab route
      // Cache the tab, push to render queue and continue iteration
      if (tabName) {
        if (!tabIsCached) {
          cachedTabs[i] = vnode;
        }

        selectedTab = tabName;
        vnode.data.attrs.active = true;
        renderQueue.push(vnode);
        continue;
      }

      // If tab was previously cached, push to render queue but don't activate
      // Otherwise push an empty node
      renderQueue.push(tabIsCached ? vnode : h());
    }

    // Post processing after initial render
    // Required for tabs within Vue components or router view
    Vue.nextTick(() => {
      for (let i = 0; i < postRenderQueue.length; i++) {
        const vnode = postRenderQueue[i];

        if (vnode && vnode.elm && vnode.elm.nodeName === 'ION-TAB') {
          const ionTab = vnode.elm as HTMLIonTabElement;
          const vnodeData = {
            data: {
              attrs: { tab: ionTab.getAttribute('tab'), routes: ionTab.getAttribute('route') },
            },
          };
          const tabName = matchRouteToTab(vnodeData as any, route);

          // Set tab active state
          ionTab.active = !!tabName;

          // Loop through all tab-bars and set active tab
          if (tabName) {
            for (const tabBar of tabBars) {
              (tabBar.elm as HTMLIonTabBarElement).selectedTab = tabName;
            }
          }

          cachedTabs[i] = vnode;
        }
      }

      // Free tab-bars references
      tabBars.length = 0;
    });

    // Render
    return h('div', { ...data, style: hostStyles }, [
      parseSlot(slots().top, selectedTab, listeners),
      h('div', { class: 'tabs-inner', style: tabsInner }, renderQueue),
      parseSlot(slots().bottom, selectedTab, listeners),
    ]);
  }
};

// Search for ion-tab-bar in VNode array
function parseSlot(slot: VNode[], tab: string, listeners: EventListeners): VNode[] {
  const vnodes = [] as VNode[];

  if (!slot) {
    return vnodes;
  }

  for (const vnode of slot) {
    vnodes.push(vnode.tag && vnode.tag.match(/ion-tab-bar$/) ? parseTabBar(vnode, tab, listeners) : vnode);
  }

  return vnodes;
}

// Set selected tab attribute and click handlers
function parseTabBar(vnode: VNode, tab: string, listeners: EventListeners): VNode {
  const { IonTabsWillChange, IonTabsDidChange } = listeners;

  if (!vnode.data) {
    vnode.data = {
      attrs: {
        'selected-tab': tab,
      },
    };
  } else if (!vnode.data.attrs) {
    vnode.data.attrs = { 'selected-tab': tab };
  } else {
    vnode.data.attrs['selected-tab'] = tab;
  }

  // Loop through ion-tab-buttons and assign click handlers
  // If custom click handler was provided, do not override it
  if (vnode.children) {
    for (const child of vnode.children) {
      if (child.tag && child.tag === 'ion-tab-button') {
        const clickHandler = (e: Event) => {
          const path = (child.elm as HTMLIonTabButtonElement).tab || '/';
          const route = hasDataAttr(child, 'to') ? child.data!.attrs!.to : { path };
          e.preventDefault();

          if (Array.isArray(IonTabsWillChange)) {
            IonTabsWillChange.map(item => item(route));
          } else if (IonTabsWillChange) {
            IonTabsWillChange(route);
          }

          vnode.context!.$router.push(route, () => {
            if (Array.isArray(IonTabsDidChange)) {
              IonTabsDidChange.map(item => item(route));
            } else if (IonTabsDidChange) {
              IonTabsDidChange(route);
            }
          });
        };

        if (!child.data || !child.data.on || !child.data.on.click) {
          Object.assign(child.data, { on: { click: clickHandler } });
        } else if (child.data.on.click) {
          // Always push our click handler to end of array
          if (Array.isArray(child.data.on.click)) {
            child.data.on.click.push(clickHandler);
          } else {
            child.data.on.click = [child.data.on.click as Function, clickHandler];
          }
        }
      }
    }
  }

  // Store a reference to the matched ion-tab-bar
  tabBars.push(vnode);

  return vnode;
}

// Check if a VNode has a specific attribute set
function hasDataAttr(vnode: VNode, attr: string) {
  return vnode.data && vnode.data.attrs && vnode.data.attrs[attr];
}

// Match tab to route through :routes property
// Otherwise match by URL
function matchRouteToTab(vnode: VNode, route: Route): string {
  if (!vnode.data || !vnode.data.attrs || !vnode.data.attrs.tab) {
    throw new Error('The tab attribute is required for an ion-tab element');
  }

  const tabName = vnode.data.attrs.tab;

  // Handle route matching by :routes attribute
  if (vnode.data.attrs.routes) {
    const routes = Array.isArray(vnode.data.attrs.routes)
      ? vnode.data.attrs.routes
      : vnode.data.attrs.routes.replace(' ', '').split(',');

    // Parse an array of possible matches
    for (const r of routes) {
      if (route.name === r) {
        return tabName;
      }
    }
  } else {
    if (route.path.indexOf(tabName) > -1) {
      return tabName;
    }
  }

  return '';
}

// CSS for ion-tabs inner and outer elements
const hostStyles = {
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  contain: 'layout size style',
};

const tabsInner = {
  position: 'relative',
  flex: 1,
  contain: 'layout size style',
};
