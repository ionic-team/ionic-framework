import {Aside, AsideParent} from 'ionic2/components/aside/aside';
import {Template, Component, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'aside-app'
})
@Template({
  // Inlined version of main.html
  inline: `<content></content>`,
  directives: [Aside, AsideParent]
})
class AsideApp {}

bootstrap(AsideApp);
