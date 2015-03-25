import {Aside} from 'ionic2/components/aside/aside';
import {Content} from 'ionic2/components/content/content';
import {View} from 'ionic2/components/view/view';
import {Template, Component, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'aside-app'
})
@Template({
  directives: [Aside, Content, View],
  url: 'main.html'
})
class AsideApp {
}

bootstrap(AsideApp);
