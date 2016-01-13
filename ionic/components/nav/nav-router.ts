import {Directive, ElementRef, DynamicComponentLoader, Attribute} from 'angular2/core';
import {
  RouterOutlet,
  Router,
  ComponentInstruction,
  Instruction,
  Location} from 'angular2/router';

import {Nav} from './nav';

/**
 * @private
 */
@Directive({
  selector: 'ion-nav'
})
export class NavRouter extends RouterOutlet {
  private _activeViewId;
  
  constructor(
    _elementRef: ElementRef, 
    _loader: DynamicComponentLoader,
    _parentRouter: Router, 
    @Attribute('name') nameAttr: string,
    private _nav: Nav
  ) {
    super(_elementRef, _loader, _parentRouter, nameAttr);

    // register this router with Ionic's NavController
    // Ionic's NavController will call this NavRouter's "stateChange"
    // method when the NavController has...changed its state
    _nav.registerRouter(this);
  }

  /**
   * @private
   * TODO
   * @param {ComponentInstruction} instruction  TODO
   */
  activate(nextInstruction: ComponentInstruction): Promise<any> {
    var previousInstruction = this._currentInstruction;
    this._currentInstruction = nextInstruction;
    var componentType = nextInstruction.componentType;
    var childRouter = this._parentRouter.childRouter(componentType);

    // prevent double navigations to the same view
    var lastView = this._nav.last();
    if (this._nav.isTransitioning() || lastView && lastView.componentType === componentType && lastView.params.data === nextInstruction.params) {
      return Promise.resolve();
    }

    // tell the NavController which componentType, and it's params, to navigate to
    return this._nav.push(componentType, nextInstruction.params);
  }

  reuse(nextInstruction: ComponentInstruction) {
    return Promise.resolve();
  }

  /**
   * TODO
   * @param {TODO} type  TODO
   * @param {TODO} viewCtrl  TODO
   */
  stateChange(type, viewCtrl) {
    // stateChange is called by Ionic's NavController
    // type could be "push" or "pop"
    // viewCtrl is Ionic's ViewController class, which has the properties "componentType" and "params"

    // only do an update if there's an actual view change
    if (!viewCtrl || this._activeViewId === viewCtrl.id) return;
    this._activeViewId = viewCtrl.id;

    // get the best PathRecognizer for this view's componentType
    let pathRecognizer = this.getPathRecognizerByComponent(viewCtrl.componentType);
    if (pathRecognizer) {

      // generate a componentInstruction from the view's PathRecognizer and params
      let componentInstruction = pathRecognizer.generate(viewCtrl.data);

      // create a ResolvedInstruction from the componentInstruction
      let instruction = new ResolvedInstruction(componentInstruction, null);

      this._parentRouter.navigateByInstruction(instruction);
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

// TODO: hacked from
// https://github.com/angular/angular/blob/6ddfff5cd59aac9099aa6da5118c5598eea7ea11/modules/angular2/src/router/instruction.ts#L207
class ResolvedInstruction extends Instruction {
  constructor(public component: ComponentInstruction, public child: Instruction,
              public auxInstruction: {[key: string]: Instruction}) {
    super();
  }

  resolveComponent(): Promise<ComponentInstruction> {
    return Promise.resolve(this.component);
  }
}
