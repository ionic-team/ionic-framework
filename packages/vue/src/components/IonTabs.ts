import { h, defineComponent, VNode } from 'vue';
import { IonRouterOutlet } from './IonRouterOutlet';

const WILL_CHANGE = 'ionTabsWillChange';
const DID_CHANGE = 'ionTabsDidChange';

export const IonTabs = defineComponent({
  name: 'IonTabs',
  emits: [WILL_CHANGE, DID_CHANGE],
  data() {
    return { didWarn: false }
  },
  render() {
    const { $slots: slots, $emit, $data } = this;
    const slottedContent = slots.default && slots.default();
    let userProvidedRouterOutlet;

    if (slottedContent && slottedContent.length > 0) {
      /**
       * If developer passed in their own ion-router-outlet
       * instance, then we should not init a default one
       */
      userProvidedRouterOutlet = slottedContent.find((child: VNode) => child.type && (child.type as any).name === 'IonRouterOutlet');
    }

    let childrenToRender = [
      h('div', {
        class: 'tabs-inner',
        style: {
            'position': 'relative',
            'flex': '1',
            'contain': 'layout size style'
        }
      }, (userProvidedRouterOutlet) ? userProvidedRouterOutlet : [h(IonRouterOutlet, { tabs: true })])
    ];

    if (!userProvidedRouterOutlet && !$data.didWarn) {
      console.warn(`[@ionic/vue Deprecation] Starting in Ionic Vue v6.0, developers must add an 'ion-router-outlet' instance inside of 'ion-tabs'.

      Before:

      <ion-tabs>
        <ion-tab-bar slot="bottom">
          ...
        </ion-tab-bar>
      </ion-tabs>

      After:

      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          ...
        </ion-tab-bar>
      </ion-tabs>

      Be sure to import 'IonRouterOutlet' from '@ionic/vue' and provide that import to your Vue component. See https://ionicframework.com/docs/vue/navigation#working-with-tabs for more information.
      `);

      $data.didWarn = true;
    }

    /**
     * If ion-tab-bar has slot="top" it needs to be
     * rendered before `.tabs-inner` otherwise it will
     * not show above the tab content.
     */
    if (slottedContent && slottedContent.length > 0) {

      /**
       * Render all content except for router outlet
       * since that needs to be inside of `.tabs-inner`.
       */
      const filteredContent = slottedContent.filter((child: VNode) => (
        !child.type ||
        (child.type && (child.type as any).name !== 'IonRouterOutlet')
      ));

      const slottedTabBar = filteredContent.find((child: VNode) => child.type && (child.type as any).name === 'IonTabBar');
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
          ...filteredContent,
          ...childrenToRender
        ];
      } else {
        childrenToRender = [
          ...childrenToRender,
          ...filteredContent
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
