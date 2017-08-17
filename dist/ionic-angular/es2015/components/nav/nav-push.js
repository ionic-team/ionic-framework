import { Directive, HostListener, Input, Optional } from '@angular/core';
import { NavController } from '../../navigation/nav-controller';
/**
 * \@name NavPush
 * \@description
 * Directive to declaratively push a new page to the current nav
 * stack.
 *
 * \@usage
 * ```html
 * <button ion-button [navPush]="pushPage"></button>
 * ```
 *
 * To specify parameters you can use array syntax or the `navParams`
 * property:
 *
 * ```html
 * <button ion-button [navPush]="pushPage" [navParams]="params">Go</button>
 * ```
 *
 * Where `pushPage` and `params` are specified in your component,
 * and `pushPage` contains a reference to a
 * component you would like to push:
 *
 * ```ts
 * import { LoginPage } from './login';
 *
 * \@Component({
 *   template: `<button ion-button [navPush]="pushPage" [navParams]="params">Go</button>`
 * })
 * class MyPage {
 *   params: Object;
 *   pushPage: any;
 *   constructor(){
 *     this.pushPage = LoginPage;
 *     this.params = { id: 42 };
 *   }
 * }
 * ```
 *
 * \@demo /docs/demos/src/navigation/
 * @see {\@link /docs/components#navigation Navigation Component Docs}
 * @see {\@link ../NavPop NavPop API Docs}
 *
 */
export class NavPush {
    /**
     * @param {?} _nav
     */
    constructor(_nav) {
        this._nav = _nav;
        if (!_nav) {
            console.error('navPush must be within a NavController');
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    onClick() {
        if (this._nav && this.navPush) {
            this._nav.push(this.navPush, this.navParams);
            return false;
        }
        return true;
    }
}
NavPush.decorators = [
    { type: Directive, args: [{
                selector: '[navPush]'
            },] },
];
/**
 * @nocollapse
 */
NavPush.ctorParameters = () => [
    { type: NavController, decorators: [{ type: Optional },] },
];
NavPush.propDecorators = {
    'navPush': [{ type: Input },],
    'navParams': [{ type: Input },],
    'onClick': [{ type: HostListener, args: ['click',] },],
};
function NavPush_tsickle_Closure_declarations() {
    /** @type {?} */
    NavPush.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NavPush.ctorParameters;
    /** @type {?} */
    NavPush.propDecorators;
    /**
     * \@input {Page | string} The component class or deeplink name you want to push onto the navigation stack.
     * @type {?}
     */
    NavPush.prototype.navPush;
    /**
     * \@input {any} Any NavParams you want to pass along to the next view.
     * @type {?}
     */
    NavPush.prototype.navParams;
    /** @type {?} */
    NavPush.prototype._nav;
}
//# sourceMappingURL=nav-push.js.map