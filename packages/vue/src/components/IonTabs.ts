import { h, defineComponent, onMounted } from 'vue';
import { IonRouterOutlet } from './IonRouterOutlet';

export const IonTabs = defineComponent({
  name: 'IonTabs',
  data() {
    // TODO clean this up
    let r: any;
    let promise = new Promise((resolve) => r = resolve);

    onMounted(() => r());

    const onTabUpdate = async (route: any) => {
      await promise;

      const { ionTabsRef } = this.$refs as any;
      const { tab } = route;
      const tabBar = ionTabsRef.querySelector('ion-tab-bar');

      tabBar.selectedTab = tab;
    }

    return { onTabUpdate }
  },
  render() {
    const { $slots: slots, onTabUpdate } = this;
    return h(
      'div',
      {
        class: 'ion-tabs',
        style: {
          'display': 'flex',
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'right': '0',
          'bottom': '0',
          'flex-direction': 'column',
          'width': '100%',
          'height': '100%',
          'contain': 'layout size style',
          'z-index': '0'
        },
        ref: 'ionTabsRef'
      },
      [
        h(
          'div',
          {
            class: 'tabs-inner',
            style: {
              'position': 'relative',
              'flex': '1',
              'contain': 'layout size style'
            }
          },
          [
            h(IonRouterOutlet, { tabs: true, onStackEvents: onTabUpdate.bind(this)  })
          ]
        ),
        ...slots.default && slots.default()
      ]
    )
  }
});
