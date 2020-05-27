import { CreateElement, RenderContext } from 'vue';

export default {
  name: 'IonPage',
  functional: true,
  render(h: CreateElement, { children }: RenderContext) {
    return h('div', { class: { 'ion-page': true } }, children);
  }
};
