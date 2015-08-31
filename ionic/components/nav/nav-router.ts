import {Directive, ElementRef, DynamicComponentLoader, Attribute} from 'angular2/angular2';
import {
  RouterOutlet,
  Router,
  ComponentInstruction,
  Instruction,
  Location} from 'angular2/router';

import {Nav} from './nav';

/**
 * TODO
 */
@Directive({
  selector: 'ion-nav'
})
export class NavRouter extends RouterOutlet {

  /**
   * TODO
   * @param {ElementRef} _elementRef  TODO
   * @param {DynamicComponentLoader} _loader  TODO
   * @param {Router} _parentRouter  TODO
   * @param {string} nameAttr  Value of the element's 'name' attribute
   * @param {Nav} nav  TODO
   */
  constructor(_elementRef: ElementRef, _loader: DynamicComponentLoader,
              _parentRouter: Router, @Attribute('name') nameAttr: string,
              nav: Nav) {
    super(_elementRef, _loader, _parentRouter, nameAttr);

    // Nav is Ionic's ViewController, which we injected into this class
    this.nav = nav;

    // register this router with Ionic's ViewController
    // Ionic's ViewController will call this NavRouter's "stateChange"
    // method when the ViewController has...changed its state
    nav.registerRouter(this);
  }

  /**
   * @private
   * TODO
   * @param {ComponentInstruction} instruction  TODO
   */
  _activate(instruction: ComponentInstruction): Promise<any> {
    var previousInstruction = this._currentInstruction;
    this._currentInstruction = instruction;
    var componentType = instruction.componentType;
    this.childRouter = this._parentRouter.childRouter(componentType);

    // tell the ViewController which componentType, and it's params, to navigate to
    this.nav.push(componentType, instruction.params);
  }

  /**
   * TODO
   * @param {TODO} type  TODO
   * @param {TODO} viewItem  TODO
   */
  stateChange(type, viewItem) {
    // stateChange is called by Ionic's ViewController
    // type could be "push" or "pop"
    // viewItem is Ionic's ViewItem class, which has the properties "componentType" and "params"

    // only do an update if there's an actual view change
    if (!viewItem || this._activeViewId === viewItem.id) return;
    this._activeViewId = viewItem.id;

    // get the best PathRecognizer for this view's componentType
    let pathRecognizer = this.getPathRecognizerByComponent(viewItem.componentType);
    if (pathRecognizer) {

      // generate a componentInstruction from the view's PathRecognizer and params
      let componentInstruction = pathRecognizer.generate(viewItem.params.data);

      // create an Instruction from the componentInstruction
      let instruction = new Instruction(componentInstruction, null);

      // update the browser's URL
      this._parentRouter.navigateInstruction(instruction);
    }
  }

  /**
   * TODO
   * @param {TODO} componentType  TODO
   * @returns {TODO} TODO
   */
  getPathRecognizerByComponent(componentType) {
    // given a componentType, figure out the best PathRecognizer to use
    let rules = this._parentRouter.registry._rules;

    let pathRecognizer = null;
    rules.forEach((rule) => {

      pathRecognizer = rule.matchers.find((matcherPathRecognizer) => {
        return (matcherPathRecognizer.handler.componentType === componentType);
      });

    });

    return pathRecognizer;
  }

}
