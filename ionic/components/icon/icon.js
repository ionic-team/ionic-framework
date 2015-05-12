import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';


@Directive({
  selector: 'ion-icon,ionicon,icon'
})
export class Icon {
  constructor() {
    //ngEle.domElement.setAttribute('aria-hidden', 'hidden')
  }
}
