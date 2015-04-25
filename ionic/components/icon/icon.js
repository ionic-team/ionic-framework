import {NgElement, Decorator} from 'angular2/angular2'

@Decorator({
  selector: 'ion-icon,ionicon,icon'
})
export class Icon {
  constructor(@NgElement() ngEle:NgElement) {
    ngEle.domElement.setAttribute('aria-hidden', 'hidden')
  }
}
