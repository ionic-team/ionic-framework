import { h, defineComponent, VNode } from 'vue';
import { IonRouterOutlet } from './IonRouterOutlet';

const WILL_CHANGE = 'ionTabsWillChange';
const DID_CHANGE = 'ionTabsDidChange';

export const IonTabs = defineComponent({
  name: 'IonTabs',
  emits: [WILL_CHANGE, DID_CHANGE],
  render() {
    const { $slots: slots, $emit } = this;
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
      const slottedTabBar = slottedContent.find((child: VNode) => child.type && (child.type as any).name === 'IonTabBar');
      const hasTopSlotTabBar = slottedTabBar && slottedTabBar.props?.slot === 'top';

      if (slottedTabBar) {
        if (!slottedTabBar.props) {
          slottedTabBar.props = {};
        }
        /**
         * ionTabsWillChange and ionTabsDidChange are
         * fired from `ion-tabs`, so we need to pass these down
         * as props so they can fire when the active tab changes.
         * TODO: We may want to move logic from the tab bar into here
         * so we do not have code split across two components.
         */
        slottedTabBar.props._tabsWillChange = (tab: string) => $emit(WILL_CHANGE, { tab });
        slottedTabBar.props._tabsDidChange = (tab: string) => $emit(DID_CHANGE, { tab });
      }

      if (hasTopSlotTabBar) {
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
