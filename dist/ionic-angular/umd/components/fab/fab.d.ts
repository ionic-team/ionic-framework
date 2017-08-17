import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
  * @name FabButton
  * @module ionic
  *
  * @description
  * FABs (Floating Action Buttons) are standard material design components. They are shaped as a circle that represents a promoted action. When pressed, it may contain more related actions.
  * FABs as its name suggests are floating over the content in a fixed position. This is not achieved exclusively with `<button ion-fab>Button</button>` but it has to wrapped with the `<ion-fab>` component, like this:
  *
  * ```html
  * <ion-content>
  *  <!-- Real floating action button, fixed. It will not scroll with the content -->
  *  <ion-fab>
  *    <button ion-fab>Button</button>
  *  </ion-fab>
  *
  *  <!-- Button shaped as a circle that just like a normal button scrolls with the content -->
  *  <button ion-fab>Button</button>
  * </ion-content>
  *
  * ```
  *
  * In case the button is not wrapped with `<ion-fab>`, the fab button will behave like a normal button, scrolling with the content.
  *
  * See [ion-fab] to learn more information about how to position the fab button.
  *
  * @property [mini] - Makes a fab button with a reduced size.
  *
  * @usage
  *
  * ```html
  *
  * <!-- Colors -->
  * <ion-fab>
  *   <button ion-fab color="primary">Button</button>
  * </ion-fab>
  *
  * <!-- Mini -->
  * <ion-fab>
  *   <button ion-fab mini>Small</button>
  * </ion-fab>
  * ```
  *
  * @demo /docs/demos/src/fab/
  * @see {@link /docs/components#fabs FAB Component Docs}
 */
export declare class FabButton extends Ion {
    constructor(config: Config, elementRef: ElementRef, renderer: Renderer);
    /**
     * @hidden
     */
    setActiveClose(closeVisible: boolean): void;
}
