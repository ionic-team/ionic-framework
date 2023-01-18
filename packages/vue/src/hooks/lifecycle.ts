import type { ComponentInternalInstance} from 'vue';
import { getCurrentInstance } from 'vue';

import { LifecycleHooks } from '../utils';

/**
 * Creates an returns a function that
 * can be used to provide a lifecycle hook.
 */
const injectHook = (lifecycleType: LifecycleHooks, hook: Function, component: ComponentInternalInstance | null): Function | undefined => {
  if (component) {

    // Add to public instance so it is accessible to IonRouterOutlet
    const target = component as any;
    const hooks = target.proxy[lifecycleType] || (target.proxy[lifecycleType] = []);
    /**
     * Define property on public instances using `setup` syntax in Vue 3.x
     */
    if (target.exposed) {
      target.exposed[lifecycleType] = hooks;
    }
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
