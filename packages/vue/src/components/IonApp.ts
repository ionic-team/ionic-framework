import { h, defineComponent, shallowRef, VNode } from 'vue';

const userComponents = shallowRef([]);
export const IonApp = defineComponent({
  name: 'IonApp',
  setup(_, { attrs, slots }) {
    return () => {
      return h(
        'ion-app',
        {
          ...attrs
        },
        [slots.default && slots.default(), ...userComponents.value]
      )
    }
  }
});

/**
 * When rendering user components inside of
 * ion-modal, ion-popover, or ion-nav, the component
 * needs to be created inside of the current application
 * context otherwise libraries such as vue-i18n or vuex
 * will not work properly.
 *
 * `userComponents` renders teleported components as children
 * of `ion-app` within the current application context.
 */
export const addTeleportedUserComponent = (component: VNode) => {
  userComponents.value = [
    ...userComponents.value,
    component
  ]
}

export const removeTeleportedUserComponent = (component: VNode) => {
  userComponents.value = userComponents.value.filter(cmp => cmp !== component);
}
