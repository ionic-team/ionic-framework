import {bind, Injector} from 'angular2/di';
import {bootstrap, ElementRef, NgFor} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {FormBuilder, Control, ControlGroup, Validators, formDirectives} from 'angular2/forms';

import {Modal, ModalRef, Nav, Segment, Animation,
  SegmentButton, Slides, Slide, Content, Button, List, Item} from 'ionic/ionic';
import {NavController, NavbarTemplate, NavParams, Navbar} from 'ionic/ionic';

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [formDirectives, Nav, Slides, Slide, Content, Button, List, Item, NgFor, ParallaxEffect]
})
export class IonicApp {
  constructor() {

    this.items = [];
    for(let i = 0; i < 100; i++) {
      this.items.push({
        title: 'Item ' + i
      })
    }
  }
}

@Directive({
  selector: '[parallax]',
  properties: [
    'parallax',
    'counter'
  ]
})
export class ParallaxEffect {
  constructor(
    content: Content,
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement;
    this.scroller = this.domElement.querySelector('.scroll-content');
    this.scroller.addEventListener('scroll', (e) => {
      this.counter.innerHTML = e.target.scrollTop;
    });

    setTimeout(() => {
      console.log('Watching', this.parallax, this.counter);
    })
  }
}

export function main() {
  bootstrap(IonicApp);
}
