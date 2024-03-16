import type { EventSpy } from '../page/event-spy';

export function toHaveReceivedEvent(eventSpy: EventSpy) {
  if (eventSpy === undefined || eventSpy === null) {
    return {
      message: () => `expected spy to have received event, but it was not defined`,
      pass: false,
    };
  }
  if (typeof (eventSpy as any).then === 'function') {
    return {
      message: () =>
        `expected spy to have received event, but it was not resolved (did you forget an await operator?).`,
      pass: false,
    };
  }
  const pass = eventSpy.events.length > 0;
  if (pass) {
    return {
      message: () => `expected to have called ${eventSpy.eventName} event`,
      pass: true,
    };
  }
  return {
    message: () => `expected to have not called ${eventSpy.eventName} event`,
    pass: false,
  };
}
