import { Injectable } from '@angular/core';

@Injectable()
export class NavController {

  private direction = 0;
  private stack: string[] = [];

  setGoback() {
    this.direction = -1;
  }

  consumeDirection() {
    if (this.direction === 0) {
      const index = this.stack.indexOf(document.location.href);
      if (index === -1) {
        this.stack.push(document.location.href);
        this.direction = 1;
      } else {
        this.stack = this.stack.slice(0, index + 1);
        this.direction = -1;
      }
    }
    const direction = this.direction;
    this.direction = 0;
    return direction;
  }
}
