import { Events } from '../events';

describe('Events service', () => {
  let events: Events;
  let listener: jasmine.Spy;

  beforeEach(() => {
    events = new Events();
  });

  it('should call listener when event is published', () => {
    const eventData = {};

    listener = jasmine.createSpy('listener');
    events.subscribe('test', listener);
    events.publish('test', eventData);

    expect(listener).toHaveBeenCalledWith(eventData);
  });

  it('should unsubscribe listener', () => {
    listener = jasmine.createSpy('listener');
    const subscription = events.subscribe('test', listener);
    subscription.unsubscribe();
    events.publish('test');

    expect(listener).not.toHaveBeenCalled();
  });

  it('should provide observable for the topic', () => {
    const listener = jasmine.createSpy('listener');
    const eventData = {};

    events.topic('test').subscribe(listener);
    events.publish('test');

    expect(listener).toHaveBeenCalledWith(eventData);
  });

  it('should create new observable for the topic if the current one was completed', () => {
    const originalTopic = events.topic('test');

    events.topic('test').complete();

    expect(events.topic('test')).not.toEqual(originalTopic);
  })
});
