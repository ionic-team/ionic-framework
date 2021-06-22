import { BackButtonEvent } from '@ionic/core/components';
import {
  inject,
  ref,
  Ref,
  ComponentInternalInstance,
  getCurrentInstance
} from 'vue';
import { LifecycleHooks } from './utils';
import { AnimationBuilder } from './';
import { Location } from './types';

type Handler = (processNextHandler: () => void) => Promise<any> | void | null;

export type RouteAction = 'push' | 'pop' | 'replace';
export type RouteDirection = 'forward' | 'back' | 'root' | 'none';

export interface IonRouter {
  canGoBack: (deep?: number) => boolean;
  push: (location: string | Location, routerAnimation?: AnimationBuilder) => void;
  replace: (location: string | Location, routerAnimation?: AnimationBuilder) => void;
  back: (routerAnimation?: AnimationBuilder) => void;
  forward: (routerAnimation?: AnimationBuilder) => void;
  navigate: (
    location: string | Location,
    routerDirection?: RouteDirection,
    routerAction?: RouteAction,
    routerAnimation?: AnimationBuilder
  ) => void;
}

export interface IonKeyboardRef {
  isOpen: Ref<boolean>;
  keyboardHeight: Ref<number>;
  unregister: () => void
}

export const useBackButton = (priority: number, handler: Handler) => {
  const callback = (ev: BackButtonEvent) => ev.detail.register(priority, handler);
  const unregister = () => document.removeEventListener('ionBackButton', callback);

  document.addEventListener('ionBackButton', callback);

  return { unregister };
}

export const useIonRouter = (): IonRouter => {
  const {
    canGoBack,
    goBack,
    goForward,
    handleNavigate
  } = inject('navManager') as any;

  const navigate = (
    location: string | Location,
    routerDirection?: RouteDirection,
    routerAction?: RouteAction,
    routerAnimation?: AnimationBuilder
  ) => handleNavigate(location, routerAction, routerDirection, routerAnimation);

  const push = (
    location: string | Location,
    routerAnimation?: AnimationBuilder
  ) => navigate(location, 'forward', 'push', routerAnimation);

  const replace = (
    location: string | Location,
    routerAnimation?: AnimationBuilder
  ) => navigate(location, 'root', 'replace', routerAnimation);

  const back = (
    routerAnimation?: AnimationBuilder
  ) => goBack(routerAnimation);

  const forward = (
    routerAnimation?: AnimationBuilder
  ) => goForward(routerAnimation);

  return {
    canGoBack,
    push,
    replace,
    back,
    forward,
    navigate
  } as IonRouter
}

export const useKeyboard = (): IonKeyboardRef => {
  let isOpen = ref(false);
  let keyboardHeight = ref(0);

  const showCallback = (ev: CustomEvent) => {
    isOpen.value = true;
    keyboardHeight.value = ev.detail.keyboardHeight;
  }

  const hideCallback = () => {
    isOpen.value = false;
    keyboardHeight.value = 0;
  }

  const unregister = () => {
    if (typeof (window as any) !== 'undefined') {
      window.removeEventListener('ionKeyboardDidShow', showCallback);
      window.removeEventListener('ionKeyboardDidHide', hideCallback);
    }
  }

  if (typeof (window as any) !== 'undefined') {
    window.addEventListener('ionKeyboardDidShow', showCallback);
    window.addEventListener('ionKeyboardDidHide', hideCallback);
  }

  return {
    isOpen,
    keyboardHeight,
    unregister
  }
}

/**
 * Creates an returns a function that
 * can be used to provide a lifecycle hook.
 */
const injectHook = (lifecycleType: LifecycleHooks, hook: Function, component: ComponentInternalInstance | null): Function | undefined => {
  if (component) {

    // Add to public instance so it is accessible to IonRouterOutlet
    const target = component as any;
    const hooks = target.proxy[lifecycleType] || (target.proxy[lifecycleType] = []);
    const wrappedHook = (...args: unknown[]) => {
      if (target.isUnmounted) {
        return;
      }

      return args ? hook(...args) : hook();
    };

    hooks.push(wrappedHook);

    return wrappedHook;
  } else {
    console.warn('[@ionic/vue]: Ionic Lifecycle Hooks can only be used during execution of setup().');
  }
}

const createHook = <T extends Function = () => any>(lifecycle: LifecycleHooks) => {
  return (hook: T, target: ComponentInternalInstance | null = getCurrentInstance()) => injectHook(lifecycle, hook, target);
}

export const onIonViewWillEnter = createHook(LifecycleHooks.WillEnter);
export const onIonViewDidEnter = createHook(LifecycleHooks.DidEnter);
export const onIonViewWillLeave = createHook(LifecycleHooks.WillLeave);
export const onIonViewDidLeave = createHook(LifecycleHooks.DidLeave);
