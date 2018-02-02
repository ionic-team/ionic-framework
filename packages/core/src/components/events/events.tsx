import { Component, Listen, Method } from '@stencil/core';

const subscriptions = new Map<string, ((event?: any) => void)[]>();

@Component({
  tag: 'ion-events'
})
export class Events {

  @Method()
  subscribe(topic: string, handler: (event?: any) => void) {
    const handlers = subscriptions.get(topic) || [];
    handlers.push(handler);
    subscriptions.set(topic, handlers);
  }

  @Method()
  unsubscribe(topic: string, handler: (event?: any) => void) {
    const handlers = subscriptions.get(topic) || [];
    const newHandlers = handlers.filter(fun => fun !== handler);
    subscriptions.set(topic, newHandlers);
  }

  @Method()
  publish(topic: string, event?: any) {
    return publishImpl(topic, event);
  }

  @Listen('window:online')
  @Listen('window:offline')
  @Listen('window:orientationchange')
  online(event: Event) {
   return publishImpl(`app:${event.type}`, event);
  }

  @Listen('window:statusTap')
  statusTap(event: Event) {
    return publishImpl(`app:${event.type}`, event);
  }

}

// make this method async just to give the browser a chance to chill and do what it needs to do before firing this off
function publishImpl(topic: string, event: any): Promise<any> {
  return Promise.resolve().then(() => {
    const handlers = subscriptions.get(topic) || [];
    for (const handler of handlers) {
      handler(event);
    }
  });
}
