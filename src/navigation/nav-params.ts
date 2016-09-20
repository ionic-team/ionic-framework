/**
 * @name NavParams
 * @description
 * NavParams are an object that exists on a page and can contain data for that particular view.
 * Similar to how data was pass to a view in V1 with `$stateParams`, NavParams offer a much more flexible
 * option with a simple `get` method.
 *
 * @usage
 * ```ts
 * export class MyClass{
 *  constructor(public params: NavParams){
 *    // userParams is an object we have in our nav-parameters
 *    this.params.get('userParams');
 *  }
 * }
 * ```
 * @demo /docs/v2/demos/src/nav-params/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../NavController/ NavController API Docs}
 * @see {@link ../Nav/ Nav API Docs}
 * @see {@link ../NavPush/ NavPush API Docs}
 */
export class NavParams {

  /**
   * @private
   * @param {TODO} data  TODO
   */
  constructor(public data: any = {}) {}

  /**
   * Get the value of a nav-parameter for the current view
   *
   * ```ts
   * export class MyClass{
   *  constructor(public params: NavParams){
   *    // userParams is an object we have in our nav-parameters
   *    this.params.get('userParams');
   *  }
   * }
   * ```
   *
   *
   * @param {string} parameter Which param you want to look up
   */
  get(param: string): any {
    return this.data[param];
  }
}
