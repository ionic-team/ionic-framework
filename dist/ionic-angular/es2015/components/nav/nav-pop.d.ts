import { NavController } from '../../navigation/nav-controller';
/**
 * @name NavPop
 * @description
 * Directive to declaratively pop the current page off from the
 * navigation stack.
 *
 * @usage
 * ```html
 * <ion-content>
 *
 *  <button ion-button navPop>Go Back</button>
 *
 * </ion-content>
 * ```
 *
 * Similar to {@link /docs/api/components/nav/NavPush/ `NavPush` }
 * @demo /docs/demos/src/navigation/
 * @see {@link /docs/components#navigation Navigation Component Docs}
 * @see {@link ../NavPush NavPush API Docs}
 */
export declare class NavPop {
    _nav: NavController;
    constructor(_nav: NavController);
    /**
     * @hidden
     */
    onClick(): boolean;
}
