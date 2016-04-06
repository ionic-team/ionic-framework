import {Directive, ElementRef, DynamicComponentLoader, Attribute} from 'angular2/core';
import {
  RouterOutlet,
  Router,
  ComponentInstruction,
  Instruction,
  Location} from 'angular2/router';

import {Nav} from './nav';
import {ViewController} from './view-controller';

/**
 * @private
 */
@Directive({
  selector: 'ion-nav'
})
export class NavRouter extends RouterOutlet {
  private _lastUrl: string;
  private _nav: Nav;
  private _parent: Router;

  constructor(
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    parentRouter: Router,
    @Attribute('name') nameAttr: string,
    nav: Nav
  ) {
    if (nav.parent) {
      parentRouter = parentRouter.childRouter(nav);
    }
    super(elementRef, loader, parentRouter, nameAttr);

    this._nav = nav;
    this._parent = parentRouter;

    // register this router with Ionic's NavController
    // Ionic's NavController will call this NavRouter's "stateChange"
    // method when the NavController has...changed its state
    nav.registerRouter(this);
  }

  stateChange(direction: string, viewCtrl: ViewController) {
    // stateChange is called by Ionic's NavController
    // viewCtrl is Ionic's ViewController class, which has the properties "componentType" and "params"

    // only do an update if there's an actual view change
    if (!viewCtrl) {
      return;
    }

    // get the best PathRecognizer for this view's componentType
    let pathRecognizer = this.getPathRecognizerByComponent(viewCtrl.componentType);
    if (pathRecognizer) {

      // generate a componentInstruction from the view's PathRecognizer and params
      let componentInstruction = pathRecognizer.generate(viewCtrl.data);

      // create a ResolvedInstruction from the componentInstruction
      let instruction = new ResolvedInstruction(componentInstruction, null, null);
      if (instruction) {
        let url = instruction.toRootUrl();
        if (url === this._lastUrl) return;

        this._lastUrl = url;

        this._parent.navigateByInstruction(instruction);

        console.debug('NavRouter, stateChange, name:', viewCtrl.name, 'id:', viewCtrl.id, 'url:', url);
      }
    }
  }

  activate(nextInstruction: ComponentInstruction): Promise<any> {
    var previousInstruction = this['_currentInstruction'];
    this['_currentInstruction'] = nextInstruction;
    var componentType = nextInstruction.componentType;
    var childRouter = this._parent.childRouter(componentType);

    // prevent double navigations to the same view
    let instruction = new ResolvedInstruction(nextInstruction, null, null);
    let url: string;
    if (instruction) {
      url = instruction.toRootUrl();
      if (url === this._lastUrl) {
        return Promise.resolve();
      }
    }

    console.debug('NavRouter, activate:', componentType.name, 'url:', url);

    // tell the NavController which componentType, and it's params, to navigate to
    return this._nav.push(componentType, nextInstruction.params);
  }

  reuse(nextInstruction: ComponentInstruction) {
    return Promise.resolve();
  }

  getPathRecognizerByComponent(componentType) {
    // given a componentType, figure out the best PathRecognizer to use
    let rules = this._parent.registry['_rules'];

    let pathRecognizer = null;
    rules.forEach((rule) => {
      pathRecognizer = rule.rules.find(function(routeRule) {
        return routeRule.handler.componentType === componentType;
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
    super(component, child, auxInstruction);
  }

  resolveComponent(): Promise<ComponentInstruction> {
    return Promise.resolve(this.component);
  }
}
