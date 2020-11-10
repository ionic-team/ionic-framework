import { h, defineComponent, VNode } from 'vue';
import { IonRouterOutlet } from './IonRouterOutlet';

export const IonTabs = defineComponent({
  name: 'IonTabs',
  render() {
    const { $slots: slots } = this;
    const slottedContent = slots.default && slots.default();
    let childrenToRender = [
      h('div', {
        class: 'tabs-inner',
        style: {
            'position': 'relative',
            'flex': '1',
            'contain': 'layout size style'
        }
      }, [
        h(IonRouterOutlet, { tabs: true })
      ])
    ];

    /**
     * If ion-tab-bar has slot="top" it needs to be
     * rendered before `.tabs-inner` otherwise it will
     * not show above the tab content.
     */
    if (slottedContent && slottedContent.length > 0) {
      const topSlottedTabBar = slottedContent.find((child: VNode) => {
        const isTabBar = child.type && (child.type as any).name === 'IonTabBar';
        const hasTopSlot = child.props?.slot === 'top';

        return isTabBar && hasTopSlot;
      });

      if (topSlottedTabBar) {
        childrenToRender = [
          ...slottedContent,
          ...childrenToRender
        ];
      } else {
        childrenToRender = [
          ...childrenToRender,
          ...slottedContent
        ]
      }
    }

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
      childrenToRender
    )
  }
});
