import { Ref, ComponentPublicInstance } from 'vue';
import { LIFECYCLE_DID_ENTER, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_ENTER, LIFECYCLE_WILL_LEAVE } from '@ionic/core';

type LIFECYCLE_EVENTS = typeof LIFECYCLE_WILL_ENTER | typeof LIFECYCLE_DID_ENTER | typeof LIFECYCLE_WILL_LEAVE | typeof LIFECYCLE_DID_LEAVE;

const ids: { [k: string]: number } = { main: 0 };

export const generateId = (type = 'main') => {
  const id = (ids[type] ?? 0) + 1;
  ids[type] = id;
  return (id).toString();
};

// TODO types
export const fireLifecycle = (vueComponent: any, vueInstance: Ref<ComponentPublicInstance>, lifecycle: LIFECYCLE_EVENTS) => {
  if (vueComponent?.[lifecycle]) {
    vueComponent[lifecycle].bind(vueInstance?.value)();
  }

  const instance = vueInstance?.value as any;
  if (instance?.[lifecycle]) {
    instance[lifecycle]();
  }
}
