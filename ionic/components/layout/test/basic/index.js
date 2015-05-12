import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Content} from 'ionic/components/content/content';
import {Layout} from 'ionic/components/layout/layout';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, Layout]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}


export function main() {
  bootstrap(IonicApp);
}
