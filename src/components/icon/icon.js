import {NgElement, Decorator} from 'angular2/angular2'
import {Ion} from '../ion'

@Decorator({
  selector: 'ion-icon,ionicon,icon'
})
export class Icon {
  constructor(@NgElement() ngEle:NgElement) {
    ngEle.domElement.setAttribute('class', 'icon ion-home')
  }

}
