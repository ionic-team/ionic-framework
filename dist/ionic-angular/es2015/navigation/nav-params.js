/**
 * \@name NavParams
 * \@description
 * NavParams are an object that exists on a page and can contain data for that particular view.
 * Similar to how data was pass to a view in V1 with `$stateParams`, NavParams offer a much more flexible
 * option with a simple `get` method.
 *
 * \@usage
 * ```ts
 * export class MyClass{
 *  constructor(public navParams: NavParams){
 *    // userParams is an object we have in our nav-parameters
 *    this.navParams.get('userParams');
 *  }
 * }
 * ```
 * \@demo /docs/demos/src/nav-params/
 * @see {\@link /docs/components#navigation Navigation Component Docs}
 * @see {\@link ../NavController/ NavController API Docs}
 * @see {\@link /docs/api/components/nav/Nav/ Nav API Docs}
 * @see {\@link /docs/api/components/nav/NavPush/ NavPush API Docs}
 */
export class NavParams {
    /**
     * @hidden
     * @param {?=} data
     */
    constructor(data = {}) {
        this.data = data;
    }
    /**
     * Get the value of a nav-parameter for the current view
     *
     * ```ts
     * export class MyClass{
     *  constructor(public navParams: NavParams){
     *    // userParams is an object we have in our nav-parameters
     *    this.navParams.get('userParams');
     *  }
     * }
     * ```
     *
     *
     * @param {?} param
     * @return {?}
     */
    get(param) {
        return this.data[param];
    }
}
function NavParams_tsickle_Closure_declarations() {
    /** @type {?} */
    NavParams.prototype.data;
}
//# sourceMappingURL=nav-params.js.map