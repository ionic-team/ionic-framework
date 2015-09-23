import {Injectable} from 'angular2/angular2';

/**
 * Events is a pub/sub style event system for sending and responding to application-level
 * events across your app.
 */
@Injectable()
export class Events {
  constructor() {
    this.channels = [];
  }

  /**
   * Subscribe to an event topic. Events that get posted to that topic
   * will trigger the provided handler.
   *
   * @param topic the topic to subscribe to
   * @param handler the event handler
   */
  subscribe(topic, ...handlers) {
    if(!this.channels[topic]) {
      this.channels[topic] = [];
    }
    handlers.forEach((handler) => {
      this.channels[topic].push(handler);
    });
  }

  /**
   * Unsubscribe from the given topic. Your handler will
   * no longer receive events published to this topic.
   *
   * @param topic the topic to unsubscribe from
   * @param handler the event handler
   *
   * @return true if a handler was removed
   */
  unsubscribe(topic, handler) {
    let t = this.channels[topic];
    if(!t) {
      // Wasn't found, wasn't removed
      return false;
    }

    if(!handler) {
      // Remove all handlers for this topic
      delete this.channels[topic];
      return true;
    }

    // We need to find and remove a specific handler
    let i = t.indexOf(handler);

    if(i < 0) {
      // Wasn't found, wasn't removed
      return false;
    }

    t.splice(i, 1);

    // If the channel is empty now, remove it from the channel map
    if(!t.length) {
      delete this.channels[topic];
    }

    return true;
  }

  /**
   * Publish an event to the given topic.
   *
   * @param topic the topic to publish to
   * @param eventData the data to send as the event
   */
  publish(topic, ...args) {
    var t = this.channels[topic];
    if(!t) {
      return null;
    }

    let responses = [];
    t.forEach((handler) => {
      responses.push(handler(args));
    });
    return responses;
  }
}
