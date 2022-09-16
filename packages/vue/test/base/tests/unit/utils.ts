import { flushPromises } from '@vue/test-utils';
import { createAnimation } from '@ionic/vue';

export const waitForRouter = async () => {
  await flushPromises();
  await new Promise((r) => setTimeout(r, 500));
}

export const mockAnimation = () => {
  return jest.fn(() => createAnimation());
}
