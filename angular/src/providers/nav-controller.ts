import { Location } from '@angular/common';
import { Injectable, Optional } from '@angular/core';
import { NavigationExtras, NavigationStart, Router, UrlTree } from '@angular/router';
import { RouterDirection } from '@ionic/core';

import { Platform } from './platform';

export type NavDirection = 'forward' | 'back' | 'root' | 'auto';

@Injectable()
export class NavController {

  private direction: NavDirection = DEFAULT_DIRECTION;
  private animated = DEFAULT_ANIMATED;
  private guessDirection: RouterDirection = 'forward';
  private guessAnimation = false;
  private lastNavId = -1;

  constructor(
    platform: Platform,
    private location: Location,
    @Optional() private router?: Router,
  ) {
    // Subscribe to router events to detect direction
    if (router) {
      router.events.subscribe(ev => {
        if (ev instanceof NavigationStart) {
          const id = (ev.restoredState) ? ev.restoredState.navigationId : ev.id;
          this.guessAnimation = !ev.restoredState;
          this.guessDirection = id < this.lastNavId ? 'back' : 'forward';
          this.lastNavId = this.guessDirection === 'forward' ? ev.id : id;
        }
      });
    }

    // Subscribe to backButton events
    platform.backButton.subscribeWithPriority(0, () => this.goBack());
  }

  navigateForward(url: string | UrlTree | any[], animated?: boolean, extras?: NavigationExtras) {
    this.setDirection('forward', animated);
    if (Array.isArray(url)) {
      return this.router!.navigate(url, extras);
    } else {
      return this.router!.navigateByUrl(url, extras);
    }
  }

  navigateBack(url: string | UrlTree | any[], animated?: boolean, extras?: NavigationExtras) {
    this.setDirection('back', animated);
    // extras = { replaceUrl: true, ...extras };
    if (Array.isArray(url)) {
      return this.router!.navigate(url, extras);
    } else {
      return this.router!.navigateByUrl(url, extras);
    }
  }

  navigateRoot(url: string | UrlTree | any[], animated?: boolean, extras?: NavigationExtras) {
    this.setDirection('root', animated);
    if (Array.isArray(url)) {
      return this.router!.navigate(url, extras);
    } else {
      return this.router!.navigateByUrl(url, extras);
    }
  }

  goBack(animated?: boolean) {
     this.setDirection('back', animated);
     return this.location.back();
   }

  setDirection(direction: NavDirection, animated?: boolean) {
    this.direction = direction;
    this.animated = (animated === undefined)
      ? direction !== 'root'
      : animated;
  }

  consumeTransition() {
    let direction: RouterDirection = 'root';
    let animated = false;

    if (this.direction === 'auto') {
      direction = this.guessDirection;
      animated = this.guessAnimation;
    } else {
      animated = this.animated;
      direction = this.direction;
    }
    this.direction = DEFAULT_DIRECTION;
    this.animated = DEFAULT_ANIMATED;

    return {
      direction,
      animated
    };
  }
}

const DEFAULT_DIRECTION = 'auto';
const DEFAULT_ANIMATED = false;
