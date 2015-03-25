import {Component, Template, bootstrap} from 'angular2/angular2';
import {View} from 'ionic2/components/view/view';
import {Content} from 'ionic2/components/content/content';
import {ToolBar} from 'ionic2/components/toolbar/toolbar';

@Component({
  selector: '[ion-app]' 
})
@Template({
  inline: `
<ion-view view-title="!attr Title!">

  <ion-view-title>
    !ele Title!
  </ion-view-title>

  <ion-nav-items side="primary">
    <button>p1</button>
    <button>p2</button>
    <button>p3</button>
    <button>p4</button>
  </ion-nav-items>

  <ion-nav-items side="secondary">
    <button>s1</button>
    <button>s2</button>
  </ion-nav-items>

  <ion-content>
    CONTENT!!
  </ion-content>

</ion-view>
  `,
  directives: [View, Content, ToolBar]
})
class MyApp {}
bootstrap(MyApp);
