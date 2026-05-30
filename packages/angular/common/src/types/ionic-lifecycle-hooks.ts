/**
 *  https://ionicframework.com/docs/api/router-outlet#life-cycle-hooks
 */

export interface ViewWillEnter {
  /**
   * Fired when the component routing to is about to animate into view.
   */
  ionViewWillEnter(): void;
}

export interface ViewDidEnter {
  /**
   * Fired when the component routing to has finished animating.
   */
  ionViewDidEnter(): void;
}

export interface ViewWillLeave {
  /**
   * Fired when the component routing from is about to animate.
   */
  ionViewWillLeave(): void;
}

export interface ViewDidLeave {
  /**
   * Fired when the component routing to has finished animating.
   */
  ionViewDidLeave(): void;
}
