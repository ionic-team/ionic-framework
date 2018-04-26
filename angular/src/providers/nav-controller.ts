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

  private intent: NavIntent = NavIntent.Auto;
  private animated = true;
  private stack: string[] = [];

  constructor(
    @Optional() private router?: Router
  ) {}

  goForward(url: string | UrlTree, animated?: boolean, extras?: NavigationExtras) {
    this.setIntent(NavIntent.Forward, animated);
    return this.router.navigateByUrl(url, extras);
  }

  goBack(url: string | UrlTree, animated?: boolean, extras?: NavigationExtras) {
    this.setIntent(NavIntent.Back, animated);
    return this.router.navigateByUrl(url, extras);
  }

  goRoot(url: string | UrlTree, animated?: boolean, extras?: NavigationExtras) {
    this.setIntent(NavIntent.Root, animated);
    return this.router.navigateByUrl(url, extras);
  }

  setIntent(intent: NavIntent, animated?: boolean) {
    this.intent = intent;
    this.animated = (animated === undefined)
      ? intent !== NavIntent.Root
      : animated;
  }

  consumeTransition() {
    const guessDirection = this.guessDirection();

    let direction = 0;
    let animated = false;

    if (this.intent === NavIntent.Auto) {
      direction = guessDirection;
      animated = direction !== 0;
    } else {
      animated = this.animated;
      direction = intentToDirection(this.intent);
    }
    this.intent = NavIntent.Auto;
    this.animated = true;

    return {
      direction,
      animated
    };
  }

  private guessDirection() {
    const index = this.stack.indexOf(document.location.href);
    if (index === -1) {
      this.stack.push(document.location.href);
      return 1;
    } else if (index < this.stack.length - 1) {
      this.stack = this.stack.slice(0, index + 1);
      return -1;
    }
    return 0;
  }
}

function intentToDirection(intent: NavIntent): number {
  switch (intent) {
    case NavIntent.Forward: return 1;
    case NavIntent.Back: return -1;
    default: return 0;
  }
}
