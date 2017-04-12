import { Component } from '@angular/core';
import { SplitPane } from '../../../../..';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent {
  root = PageOne;

  splitPaneChanged(splitPane: SplitPane) {
    console.log('Split pane changed, visible: ', splitPane.isVisible());
  }
}
