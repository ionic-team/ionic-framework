import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AssistiveTouchProvider {
  public closeButton: EventEmitter<any> = new EventEmitter<any>();
}
