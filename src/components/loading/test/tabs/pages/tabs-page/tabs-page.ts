import { Component } from '@angular/core';
import { DeepLink } from '../../../../../..';

import { PageOne} from '../page-one/page-one';

@DeepLink()
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
 root1 = PageOne;
 root2 = 'PageTwo';
 root3 = PageOne;
}
