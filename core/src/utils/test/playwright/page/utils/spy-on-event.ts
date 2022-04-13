import type { E2EPage } from '../../playwright-declarations';
import { addE2EListener, EventSpy } from '../event-spy';

export const spyOnEvent = async (page: E2EPage, eventName: string): Promise<EventSpy> => {
  const spy = new EventSpy(eventName);

  await addE2EListener(page, eventName, (ev: Event) => spy.push(ev));

  return spy;
};
