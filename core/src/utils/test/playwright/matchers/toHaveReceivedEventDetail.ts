import { expect } from '@playwright/test';
import deepEqual from 'fast-deep-equal';

import type { EventSpy } from '../page/event-spy';

export function toHaveReceivedEventDetail(eventSpy: EventSpy, eventDetail: any) {
  if (eventSpy === null || eventSpy === undefined) {
    return {
      message: () => `toHaveReceivedEventDetail event spy is null`,
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

  if (!eventSpy.eventName) {
    return {
      message: () => `toHaveReceivedEventDetail did not receive an event spy`,
      pass: false,
    };
  }

  if (eventSpy.lastEvent === null || eventSpy.lastEvent === undefined) {
    return {
      message: () => `event "${eventSpy.eventName}" was not received`,
      pass: false,
    };
  }

  const pass = deepEqual(eventSpy.lastEvent.detail, eventDetail);

  expect(eventSpy.lastEvent.detail).toEqual(eventDetail);

  return {
    message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
    pass: pass,
  };
}
