import { Injectable } from '@angular/core';
import { IonicWindow } from '../types/interfaces';


@Injectable()
export class Events {

  subscribe(topic: string, handler: (event?: any) => void) {
    return (window as IonicWindow).Ionic.Events.subscribe(topic, handler);
  }

  unsubscribe(topic: string, handler: (event?: any) => void) {
    return (window as IonicWindow).Ionic.Events.unsubscribe(topic, handler);
  }

  publish(topic: string, event?: any) {
    return (window as IonicWindow).Ionic.Events.publish(topic, event);
  }

}
