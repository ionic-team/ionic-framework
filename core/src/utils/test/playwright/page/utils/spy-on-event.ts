import type { E2EPage } from '../../playwright-declarations';
import { addE2EListener, EventSpy } from '../event-spy';

export const spyOnEvent = async (page: E2EPage, eventName: string): Promise<EventSpy> => {
  const spy = new EventSpy(eventName);

  const handle = await page.evaluateHandle(() => window);

  await addE2EListener(page, handle, eventName, (ev: CustomEvent) => spy.push(ev));

  return spy;
};
