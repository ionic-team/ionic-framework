import { flushPromises } from '@vue/test-utils';
import { createAnimation } from '@ionic/vue';
import { vi } from 'vitest';

export const waitForRouter = async () => {
  await flushPromises();
  await new Promise((r) => setTimeout(r, 500));
}

export const mockAnimation = () => {
  return vi.fn().mockImplementation(createAnimation);
}
