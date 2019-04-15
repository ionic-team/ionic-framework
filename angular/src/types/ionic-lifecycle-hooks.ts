/**
 *  https://ionicframework.com/docs/api/router-outlet#life-cycle-hooks
 */

export interface ViewWillEnter {
  /**
   * Fired when the component being routed to is about to animate in.
   */
  ionViewWillEnter(): void;
}

export interface ViewDidEnter {
  /**
   * Fired when the component being routed to has animated in.
   */
  ionViewDidEnter(): void;
}

export interface ViewWillLeave {
  /**
   * Fired when the component being routed from is about to animate.
   */
  ionViewWillLeave(): void;
}

export interface ViewDidLeave {
  /**
   * Fired when the component being routed from has animated.
   */
  ionViewDidLeave(): void;
}
