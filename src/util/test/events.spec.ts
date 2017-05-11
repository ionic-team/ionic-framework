import { Events } from '../events';

describe('Events service', () => {
  let events: Events;
  let listener: jasmine.Spy;

  beforeEach(() => {
    events = new Events();
  });

  it('should call listener when event is published', () => {
    const eventParams = [{}, {}, {}];

    listener = jasmine.createSpy('listener');
    events.subscribe('test', listener);
    events.publish('test', ...eventParams);

    expect(listener).toHaveBeenCalledWith(...eventParams);
  });

  it('should unsubscribe listener', () => {
    listener = jasmine.createSpy('listener');
    events.subscribe('test', listener);
    events.unsubscribe('test', listener);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should return an array of responses when event is published', () => {
    const [response, anotherResponse] = [{}, {}];
    const listener = jasmine.createSpy('listener').and.returnValue(response);
    const anotherListener = jasmine.createSpy('anotherListener').and.returnValue(anotherResponse);

    events.subscribe('test', listener, anotherListener);
    const responses = events.publish('test');

    expect(responses).toEqual([response, anotherResponse]);
  });
});
