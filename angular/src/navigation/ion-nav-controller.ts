import { Injectable } from '@angular/core';

@Injectable()
export class NavController {

  private direction = 0;
  private goBack = false;
  private stack: string[] = [];

  setGoback() {
    this.goBack = true;
  }

  consumeDirection() {
    if (this.direction === 0) {
      const index = this.stack.indexOf(document.location.href);
      if (index === -1) {
        this.stack.push(document.location.href);
        this.direction = 1;
      } else if (index < this.stack.length - 1) {
        this.stack = this.stack.slice(0, index + 1);
        this.direction = -1;
      }
    }

    const direction = this.goBack
      ? -1
      : this.direction;

    this.goBack = false;
    this.direction = 0;
    return direction;
  }
}
