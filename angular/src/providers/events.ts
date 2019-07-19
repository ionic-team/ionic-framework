import { Injectable } from '@angular/core';

export type EventHandler = (...args: any[]) => any;
@Injectable({
  providedIn: 'root',
})
export class AppEvents {
  private c = new Map<string, EventHandlerHolder[]>();

  /**
   * Subscribe to an event topic. Events that get posted to that topic will trigger the provided handler.
   *
   * @param topic the topic to subscribe to
   * @param handler the event handler
   *
   * @return random id of the registered handler to unsubscribe
   */
  subscribe(topic: string, handler: EventHandler): number {
    let topics: EventHandlerHolder[] = this.c.get(topic);
    if (!topics) {
      this.c.set(topic, topics = []);
    }

    const holder: EventHandlerHolder = {
      handler,
      id: Math.floor(Math.random() * (999999 - 1) + 1) // random id for this handler
    };

    topics.push(holder);

    return holder.id;
  }

  /**
   * Unsubscribe from the given topic. Your handler will no longer receive events published to this topic.
   *
   * @param topic the topic to unsubscribe from
   * @param handler the event handler
   *
   * @return true if a handler was removed
   */
  unsubscribe(topic: string, handler?: EventHandler): boolean {
    if (!handler) {
      return this.c.delete(topic);
    }

    const topics: EventHandlerHolder[] = this.c.get(topic);
    if (!topics) {
      return false;
    }

    // We need to find and remove a specific handler
    let index = -1;
    for (let i = 0; i < topics.length; i++) {
      if (handler === topics[i].handler) {
        index = i;
        break;
      }
    }

    if (index < 0) {
      // Wasn't found, wasn't removed
      return false;
    }
    topics.splice(index, 1);
    if (topics.length === 0) {
      this.c.delete(topic);
    }
    return true;
  }

  /**
  * Unsubscribe from an event with a specific subscribed id. Your handler will no longer receive events published to this topic.
  *
  * @param topic the topic to unsubscribe from
  * @param id the event handler's id returned when subscribed
  *
  * @return true if a handler was removed
  */
  unsubscribeId(id: number): boolean {
    if (id <= 0) {
      return false;
    }

    let topic: string;
    let topics: EventHandlerHolder[];
    let index = -1;
    this.c.forEach((t, k) => {
      for (let i = 0; i < t.length; i++) {
        if (id === t[i].id) {
          index = i;
          topics = t;
          topic = k;
          return;
        }
      }
    });

    if (!topics) {
      return false;
    }

    if (index < 0) {
      // Wasn't found, wasn't removed
      return false;
    }
    topics.splice(index, 1);
    if (topics.length === 0) {
      this.c.delete(topic);
    }
    return true;
  }

  /**
   * Publish an event to the given topic.
   *
   * @param topic the topic to publish to
   * @param eventData the data to send as the event
   */
  publish(topic: string, ...args: any[]): any[] | null {
    const topics = this.c.get(topic);
    if (!topics) {
      return null;
    }
    return topics.map(handler => {
      try {
        return handler.handler(...args);
      } catch (e) {
        console.error(e);
        return null;
      }
    });
  }
}

class EventHandlerHolder {
  handler: EventHandler;
  id: number;
}
