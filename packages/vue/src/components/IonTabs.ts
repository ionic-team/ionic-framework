import { h, defineComponent } from 'vue';
import { IonRouterOutlet } from './IonRouterOutlet';

export const IonTabs = defineComponent({
  name: 'IonTabs',
  render() {
    const { $slots: slots } = this;
    return h(
      'ion-tabs',
      {
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
        }
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
            h(IonRouterOutlet)
          ]
        ),
        ...slots.default && slots.default()
      ]
    )
  }
});
