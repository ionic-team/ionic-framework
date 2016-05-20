import {Directive, ViewContainerRef, DynamicComponentLoader, Attribute} from '@angular/core';
import {
  RouterOutletMap,
  Router} from '@angular/router';

import {Nav} from './nav';
import {ViewController} from './view-controller';

/**
 * @private
 */
@Directive({
  selector: 'ion-nav'
})
export class NavRouter {

}
