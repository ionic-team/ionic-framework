import { Injectable, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router, UrlTree } from '@angular/router';
import { BackButtonEvent } from '@ionic/core';

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
    private location: Location,
    @Optional() private router?: Router
  ) {
    window && window.document.addEventListener('ionBackButton', (ev) => {
      (ev as BackButtonEvent).detail.register(0, () => this.goBack());
    });
  }

  navigateForward(url: string | UrlTree | any[], animated?: boolean, extras?: NavigationExtras) {
    this.setIntent(NavIntent.Forward, animated);
    if (Array.isArray(url)) {
      return this.router!.navigate(url, extras);
    } else {
      return this.router!.navigateByUrl(url, extras);
    }
  }

  navigateBack(url: string | UrlTree | any[], animated?: boolean, extras?: NavigationExtras) {
    this.setIntent(NavIntent.Back, animated);
    extras = { replaceUrl: true, ...extras };
    if (Array.isArray(url)) {
      return this.router!.navigate(url, extras);
    } else {
      return this.router!.navigateByUrl(url, extras);
    }
  }

  navigateRoot(url: string | UrlTree | any[], animated?: boolean, extras?: NavigationExtras) {
    this.setIntent(NavIntent.Root, animated);
    if (Array.isArray(url)) {
      return this.router!.navigate(url, extras);
    } else {
      return this.router!.navigateByUrl(url, extras);
    }
  }

  goBack(animated?: boolean) {
     this.setIntent(NavIntent.Back, animated);
     return this.location.back();
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
