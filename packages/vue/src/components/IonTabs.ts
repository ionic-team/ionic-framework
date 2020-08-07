import { h } from 'vue';
import { IonRouterOutlet } from './IonRouterOutlet';

// TODO types
export const IonTabs = (_: any, opts: any) => (
  h(
    'ion-tabs',
    [
      h(IonRouterOutlet),
      ...opts.slots.default && opts.slots.default()
    ]
  )
)
