import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {bootstrap, NgFor} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {FormBuilder, Control, ControlGroup, Validators, formDirectives} from 'angular2/forms';

import {Modal, ModalRef, Nav, Segment, Animation, SegmentButton, Slides, Slide, Content, Button, List, Item} from 'ionic/ionic';
import {NavController, NavbarTemplate, NavParams, Navbar} from 'ionic/ionic';


class FadeIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease')
      .duration(250)
      .from('opacity', 0)
      .to('opacity', 1);
  }
}

Animation.register('my-fade-in', FadeIn);

class FadeOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease')
      .duration(250)
      .from('opacity', 1)
      .to('opacity', 0);
  }
}

Animation.register('my-fade-out', FadeOut);

@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'detail.html',
  directives: [formDirectives, NavbarTemplate, Navbar, Content, Button, List, Item]
})
export class DetailPage {
  constructor(params: NavParams) {
    this.post = params.post;
  }
}

@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'feed.html',
  directives: [formDirectives, NgFor, NavbarTemplate, Navbar, Segment, SegmentButton, Content, Button, List, Item]
})
export class FeedPage {
  constructor(nav: NavController) {
    this.nav = nav;

    this.filterForm = new ControlGroup({
      filterControl: new Control("")
    });

    this.posts = [
      {
        text: 'I tried to keep both arts alive, but the camera won. I found that while the camera does not express the soul, perhaps a photograph can!',
        image: 'http://ionic-io-assets.s3.amazonaws.com/images/p.jpg',
        day: 5
      },
      {
        text: 'It is good to realize that if love and peace can prevail on earth, and if we can teach our children to honor nature\'s gifts, the joys and beauties of the outdoors will be here forever.',
        image: 'http://ionic-io-assets.s3.amazonaws.com/images/p1.png',
        day: 6
      },
      {
        text: 'I see humanity now as one vast plant, needing for its highest fulfillment only love, the natural blessings of the great outdoors, and intelligent crossing and selection.',
        image: 'http://ionic-io-assets.s3.amazonaws.com/images/p2.png',
        day: 7
      },
      {
        text: 'You must not lose faith in humanity. Humanity is an ocean; if a few drops of the ocean are dirty, the ocean does not become dirty.',
        image: 'http://ionic-io-assets.s3.amazonaws.com/images/p3.png',
        day: 7
      },
      {
        text: 'Keep close to Nature\'s heart... and break clear away, once in awhile, and climb a mountain or spend a week in the woods. Wash your spirit clean.',
        image: 'http://ionic-io-assets.s3.amazonaws.com/images/p4.png',
        day: 8
      }
    ];
  }

  postClicked(event, post) {
    console.log('Post clicked');
    this.nav.push(DetailPage, {
      post: post
    });
    event.preventDefault();
  }
}

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [formDirectives, Nav, Slides, Slide, Content, Button, List, Item]
})
export class IonicApp {
  constructor(loader: DynamicComponentLoader, injector: Injector, domRenderer: DomRenderer, elementRef: ElementRef) {
    this.feedPage = FeedPage

    this.loader = loader;
    this.domRenderer = domRenderer;
    this.elementRef = elementRef;
    this.injector = injector;

    console.log('IonicApp Start', loader, domRenderer, elementRef);
  }

  openHeart() {
    console.log('Heart');
    //Modal.show(HeartModal, this.loader, this.injector, this.domRenderer, this.elementRef);
    Modal.show(HeartModal, this.loader, this.injector, this.domRenderer, this.elementRef, {
      openAnimation: 'my-fade-in',
      closeAnimation: 'my-fade-out'
    });
  }

  openGear() {
    console.log('Gear');

    Modal.show(SettingsModal, this.loader, this.injector, this.domRenderer, this.elementRef, {
      //openAnimation: 'my-fade-in',
      //closeAnimation: 'my-fade-out'
    });
  }
}

@Component({
  selector: 'settings-modal'
})
@View({
  template: '<ion-view><ion-content padding><button primary (click)="close()">Close</button></ion-content></ion-view>',
  directives: [Nav, Button, Content]
})
export class SettingsModal {
  constructor(modalRef: ModalRef) {
    this.modalRef = modalRef;
  }
  close() {
    console.log('Closing modal');
    this.modalRef.close();
  }
}

@Component({
  selector: 'heart-modal'
})
@View({
  template: '<ion-view><ion-content padding><button primary (click)="close()">Close</button></ion-content></ion-view>',
  directives: [Nav, Button, Content]
})
export class HeartModal {
  constructor(modalRef: ModalRef) {
    this.modalRef = modalRef;
  }
  close() {
    console.log('Closing modal');
    this.modalRef.close();
  }
}

export function main() {
  bootstrap(IonicApp);
}
