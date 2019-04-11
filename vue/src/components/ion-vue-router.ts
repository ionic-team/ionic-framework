import Vue, { CreateElement, RenderContext, VNodeData } from 'vue';
import { NavDirection } from '@ionic/core';

type TransitionDone = () => void;
interface Props {
  name: string;
  animated: boolean;
}

// Component entering the view
let enteringEl: HTMLElement;

export default {
  name: 'IonVueRouter',
  functional: true,

  props: {
    // Router view name
    name: { default: 'default', type: String },
    // Disable transitions
    animated: { default: true, type: Boolean },
  },

  render(h: CreateElement, { parent, props, data, children }: RenderContext) {
    if (!parent.$router) {
      throw new Error('IonTabs requires an instance of either VueRouter or IonicVueRouter');
    }

    const ionRouterOutletData: VNodeData = {
      ...data,
      ref: 'ionRouterOutlet',
      on: { click: (event: Event) => catchIonicGoBack(parent, event) },
    };
    const routerViewData: VNodeData = { props: { name: props.name } };
    const transitionData: VNodeData = {
      props: { css: false, mode: 'in-out' },
      on: {
        leave: (el: HTMLElement, done: TransitionDone) => {
          leave(parent, props as Props, el, done);
        },
        beforeEnter,
        enter,
        afterEnter,
        beforeLeave,
        afterLeave,
        enterCancelled,
        leaveCancelled,
      }
    };

    return h('ion-router-outlet', ionRouterOutletData, [
      h('transition', transitionData, [
        h('router-view', routerViewData, children)
      ])
    ]);
  }
};

function catchIonicGoBack(parent: Vue, event: Event): void {
  // In case of nested ion-vue-routers run only once
  event.stopImmediatePropagation();

  if (!event.target) return;

  // We only care for the event coming from Ionic's back button
  const backButton = (event.target as HTMLElement).closest('ion-back-button') as HTMLIonBackButtonElement;
  if (!backButton) return;

  const $router = parent.$router;
  let defaultHref: string;

  // Explicitly override router direction to always trigger a back transition
  $router.directionOverride = 'back';

  // If we can go back - do so
  if ($router.canGoBack()) {
    event.preventDefault();
    $router.back();
    return;
  }

  // If there's a default fallback - use it
  defaultHref = backButton.defaultHref as string;
  if (undefined !== defaultHref) {
    event.preventDefault();
    $router.push(defaultHref);
  }
}

// Transition when we leave the route
function leave(parent: Vue, props: Props, el: HTMLElement, done: TransitionDone) {
  const promise = transition(parent, props, el);

  // Skip any transition if we don't get back a Promise
  if (!promise) {
    done();
    return;
  }

  // Perform navigation once the transition was finished
  parent.$router.transition = new Promise(resolve => {
    promise.then(() => {
      resolve();
      done();
    }).catch(console.error);
  });
}

// Trigger the ionic/core transitions
function transition(parent: Vue, props: Props, leavingEl: HTMLElement) {
  const ionRouterOutlet = parent.$refs.ionRouterOutlet as HTMLIonRouterOutletElement;

  // The Ionic framework didn't load - skip animations
  if (typeof ionRouterOutlet.componentOnReady === 'undefined') {
    return;
  }

  // Skip animations if there's no component to navigate to
  // or the current and the "to-be-rendered" components are the same
  if (!enteringEl || enteringEl === leavingEl) {
    return;
  }

  // Add the proper Ionic classes, important for smooth transitions
  enteringEl.classList.add('ion-page', 'ion-page-invisible');

  // Commit to the transition as soon as the Ionic Router Outlet is ready
  return ionRouterOutlet.componentOnReady().then((el: HTMLIonRouterOutletElement) => {
    return el.commit(enteringEl, leavingEl, {
      deepWait: true,
      duration: !props.animated || parent.$router.direction === 'root' ? 0 : undefined,
      direction: parent.$router.direction as NavDirection,
      showGoBack: parent.$router.canGoBack(),
    });
  }).catch(console.error);
}

// Set the component to be rendered before we render the new route
function beforeEnter(el: HTMLElement) {
  enteringEl = el;
}

// Enter the new route
function enter(_el: HTMLElement, done: TransitionDone) {
  done();
}

// Vue transition stub functions
function afterEnter(_el: HTMLElement) { /* */ }
function afterLeave(_el: HTMLElement) { /* */ }
function beforeLeave(_el: HTMLElement) { /* */ }
function enterCancelled(_el: HTMLElement) { /* */ }
function leaveCancelled(_el: HTMLElement) { /* */ }
