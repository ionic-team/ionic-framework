import { flushPromises } from '@vue/test-utils';

export const waitForRouter = async () => {
  await flushPromises();
  await new Promise((r) => setTimeout(r, 100));
}
