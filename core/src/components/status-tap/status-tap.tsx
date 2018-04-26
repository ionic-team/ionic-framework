import { Component, Listen, Prop } from '@stencil/core';
import { QueueController } from '../../interface';

@Component({
  tag: 'ion-status-tap'
})
export class StatusTap {

  @Prop({ context: 'queue' }) queue!: QueueController;
  @Prop({ context: 'window' }) win!: Window;

  @Prop() duration = 300;

  @Listen('window:statusTap')
  onStatusTap() {
    this.queue.read(() => {
      const width = this.win.innerWidth;
      const height = this.win.innerWidth;
      const el = this.win.document.elementFromPoint(width / 2, height / 2);
      if (!el) {
        return;
      }
      const scrollEl = el.closest('ion-scroll');
      if (scrollEl) {
        scrollEl.componentOnReady().then(() => {
          this.queue.write(() => {
            scrollEl.scrollToTop(this.duration);
          });
        });
      }
    });
  }

  /**
   * The back button event is triggered when the user presses the native
   * platform's back button, also referred to as the "hardware" back button.
   * This event is only used within Cordova apps running on Android and
   * Windows platforms. This event is not fired on iOS since iOS doesn't come
   * with a hardware back button in the same sense an Android or Windows device
   * does.
   *
   * Registering a hardware back button action and setting a priority allows
   * apps to control which action should be called when the hardware back
   * button is pressed. This method decides which of the registered back button
   * actions has the highest priority and should be called.
   *
   * @param {Function} fn Called when the back button is pressed,
   * if this registered action has the highest priority.
   * @param {number} priority Set the priority for this action. Only the highest priority will execute. Defaults to `0`.
   * @returns {Function} A function that, when called, will unregister
   * the back button action.
   */
  // @Method()
  // registerBackButtonAction(fn: Function, priority = 0): () => void {
  //   const newAction = {
  //     fn,
  //     priority
  //   };
  //   backButtonActions.push(newAction);

  //   return () => {
  //     backButtonActions = backButtonActions.filter(bbAction => bbAction !== newAction);
  //   };
  // }

  // @Listen('document:backbutton')
  // hardwareBackButtonPressed() {
  //   // check if menu exists and is open
  //   return checkIfMenuIsOpen().then((done: boolean) => {
  //     if (!done) {
  //       // we need to check if there is an action-sheet, alert, loading, picker, popover or toast open
  //       // if so, just return and don't do anything
  //       // Why? I have no idea, but that is the existing behavior in Ionic 3
  //       return checkIfNotModalOverlayIsOpen();
  //     }
  //     return done;
  //   }).then((done: boolean) => {
  //     if (!done) {
  //       // if there's a modal open, close that instead
  //       return closeModalIfOpen();
  //     }
  //     return done;
  //   }).then((done: boolean) => {
  //     // okay cool, it's time to pop a nav if possible
  //     if (!done) {
  //       return popEligibleView();
  //     }
  //     return done;
  //   }).then((done: boolean) => {
  //     if (!done) {
  //       // okay, we didn't find a nav that we can pop, so we should just exit the app
  //       // since each platform exits differently, just delegate it to the platform to
  //       // figure out how to exit
  //       return this.exitApp.emit();
  //     }
  //     return Promise.resolve();
  //   });
  // }
}
