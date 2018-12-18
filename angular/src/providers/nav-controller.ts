import { Location } from '@angular/common';
import { Injectable, Optional } from '@angular/core';
import { NavigationExtras, NavigationStart, Router, UrlTree } from '@angular/router';
import { NavDirection, RouterDirection } from '@ionic/core';

import { Platform } from './platform';

export interface AnimationOptions {
  animated?: boolean;
  animationDirection?: 'forward' | 'back';
}

export interface NavigationOptions extends NavigationExtras, AnimationOptions {}

@Injectable()
export class NavController {

  private direction: 'forward' | 'back' | 'root' | 'auto' = DEFAULT_DIRECTION;
  private animated?: NavDirection = DEFAULT_ANIMATED;
  private guessDirection: RouterDirection = 'forward';
  private guessAnimation?: NavDirection;
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
          this.guessDirection = id < this.lastNavId ? 'back' : 'forward';
          this.guessAnimation = !ev.restoredState ? this.guessDirection : undefined;
          this.lastNavId = this.guessDirection === 'forward' ? ev.id : id;
        }
      });
    }

    // Subscribe to backButton events
    platform.backButton.subscribeWithPriority(0, () => this.goBack());
  }

  navigateForward(url: string | UrlTree | any[], options: NavigationOptions = {}) {
    this.setDirection('forward', options.animated, options.animationDirection);
    if (Array.isArray(url)) {
      return this.router!.navigate(url, options);
    } else {
      return this.router!.navigateByUrl(url, options);
    }
  }

  navigateBack(url: string | UrlTree | any[], options: NavigationOptions = {}) {
    this.setDirection('back', options.animated, options.animationDirection);
    // extras = { replaceUrl: true, ...extras };
    if (Array.isArray(url)) {
      return this.router!.navigate(url, options);
    } else {
      return this.router!.navigateByUrl(url, options);
    }
  }

  navigateRoot(url: string | UrlTree | any[], options: NavigationOptions = {}) {
    this.setDirection('root', options.animated, options.animationDirection);
    if (Array.isArray(url)) {
      return this.router!.navigate(url, options);
    } else {
      return this.router!.navigateByUrl(url, options);
    }
  }

  goBack(options: AnimationOptions = { animated: true, animationDirection: 'back' }) {
    this.setDirection('back', options.animated, options.animationDirection);
    return this.location.back();
   }

  setDirection(direction: RouterDirection, animated?: boolean, animationDirection?: 'forward' | 'back') {
    this.direction = direction;
    this.animated = getAnimation(direction, animated, animationDirection);
  }

  consumeTransition() {
    let direction: RouterDirection = 'root';
    let animation: NavDirection | undefined;

    if (this.direction === 'auto') {
      direction = this.guessDirection;
      animation = this.guessAnimation;
    } else {
      animation = this.animated;
      direction = this.direction;
    }
    this.direction = DEFAULT_DIRECTION;
    this.animated = DEFAULT_ANIMATED;

    return {
      direction,
      animation
    };
  }
}

function getAnimation(direction: RouterDirection, animated: boolean | undefined, animationDirection: 'forward' | 'back' | undefined): NavDirection | undefined {
  if (animated === false) {
    return undefined;
  }
  if (animationDirection !== undefined) {
    return animationDirection;
  }
  if (direction === 'forward' || direction === 'back') {
    return direction;
  }
  return undefined;
}

const DEFAULT_DIRECTION = 'auto';
const DEFAULT_ANIMATED = undefined;
