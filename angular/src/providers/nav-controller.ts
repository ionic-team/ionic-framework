import { Injectable, Optional } from '@angular/core';
import { NavigationExtras, Router, UrlTree } from '@angular/router';

export const enum NavIntent {
  Auto,
  Forward,
  Back,
  Root
}

@Injectable()
export class NavController {

  private direction = 0;
  private intent: NavIntent = NavIntent.Auto;
  private stack: string[] = [];

  constructor(
    @Optional() private router?: Router
  ) {}

  goForward(url: string | UrlTree, extras?: NavigationExtras) {
    this.intent = NavIntent.Forward;
    return this.router.navigateByUrl(url, extras);
  }

  goBack(url: string | UrlTree, extras?: NavigationExtras) {
    this.intent = NavIntent.Back;
    return this.router.navigateByUrl(url, extras);
  }

  goRoot(url: string | UrlTree, extras?: NavigationExtras) {
    this.intent = NavIntent.Root;
    return this.router.navigateByUrl(url, extras);
  }

  setIntent(intent: NavIntent) {
    this.intent = intent;
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

    const direction = directionForIntent(this.intent, this.direction);

    this.intent = NavIntent.Auto;
    this.direction = 0;
    return direction;
  }
}

function directionForIntent(intent: NavIntent, nav: number): number {
  if (intent === NavIntent.Auto) {
    return nav;
  }
  return intent === NavIntent.Back ? -1 : 1;
}
