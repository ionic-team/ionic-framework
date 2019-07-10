import VueRouter, { Route } from 'vue-router';
import { PluginFunction } from 'vue';
import { RouterArgs } from './interfaces';
import IonVueRouter from './components/navigation/ion-vue-router';
import { BackButtonEvent, RouterDirection } from '@ionic/core';

// Extend the official VueRouter
export default class Router extends VueRouter {
  direction: RouterDirection;
  directionOverride: RouterDirection | null;
  viewCount: number;
  prevRouteStack: Route[];
  history: any;
  static installed: boolean;
  static install: PluginFunction<never>;

  constructor(args: RouterArgs = {} as RouterArgs) {
    super(args);

    // The direction user navigates in
    this.direction = args.direction || 'forward';

    // Override normal direction
    this.directionOverride = null;

    // Number of views navigated
    this.viewCount = args.viewCount || 0;

    // Stack of previous routes
    this.prevRouteStack = [];

    // Extend the existing history object
    this.extendHistory();

    // Wait for transition to finish before confirming navigation
    this.extendTransitionConfirmation();

    // Listen to Ionic's back button event
    document.addEventListener('ionBackButton', (e: Event) => {
      (e as BackButtonEvent).detail.register(0, () => this.back());
    });
  }

  extendTransitionConfirmation() {
    this.history._confirmTransition = this.history.confirmTransition;
    this.history.confirmTransition = async (...opts: any) => {
      if (undefined !== this.transition) {
        await this.transition;
      }
      this.history._confirmTransition(...opts);
    };
  }

  extendHistory() {
    // Save a reference to the original method
    this.history._updateRoute = this.history.updateRoute;

    this.history.updateRoute = (nextRoute: Route) => {
      // Guesstimate the direction of the next route
      this.direction = this.guessDirection(nextRoute);

      // Override the direction
      if (this.directionOverride) {
        this.direction = this.directionOverride;
      }

      // Increment or decrement the view count
      this.viewCount += this.direction === 'back' ? -1 : 1;

      // Call the original method
      this.history._updateRoute(nextRoute);

      // Reset direction overrides
      this.directionOverride = null;
    };
  }

  canGoBack(): boolean {
    // We can display the back button if we're not on /
    // or there were more than 1 views rendered
    return this.viewCount > 1 && this.currentRoute.fullPath.length > 1;
  }

  guessDirection(nextRoute: Route): RouterDirection {
    if (this.prevRouteStack.length !== 0) {
      const prevRoute: Route = this.prevRouteStack[this.prevRouteStack.length - 1];

      // Last route is the same as the next one - go back
      // If we're going to / reset the stack otherwise pop a route
      if (prevRoute.fullPath === nextRoute.fullPath) {
        if (prevRoute.fullPath.length === 1) {
          this.prevRouteStack = [];
        } else {
          this.prevRouteStack.pop();
        }
        return 'back';
      }
    }

    // Forward movement, push next route to stack
    if (this.history.current.fullPath !== nextRoute.fullPath) {
      this.prevRouteStack.push(this.history.current);
    }
    return 'forward';
  }
}

Router.install = (Vue) => {
  // If already installed - skip
  if (Router.installed) {
    return;
  }

  Router.installed = true;

  // Install the official VueRouter
  VueRouter.install(Vue);

  // Register the IonVueRouter component globally
  Vue.component('IonVueRouter', IonVueRouter);
};
