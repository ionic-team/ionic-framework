import {NgFor, NgIf} from 'angular2/angular2';
import {NgSwitch, NgSwitchWhen} from 'angular2/angular2'
import {formDirectives} from 'angular2/forms';

import {View} from 'angular2/src/core/annotations_impl/view';

import {
  Aside, Content, Refresher,
  Slides, Slide, SlidePager,
  Tabs, Tab,
  ActionMenu,
  List, Item,
  Icon,
  Checkbox, Switch, Label, Input, Segment, SegmentButton,
  RadioGroup, RadioButton, SearchBar,
  Nav, NavbarTemplate, Navbar, NavPush, NavPop
} from 'ionic/ionic';


export class IonicView extends View {
  constructor(config) {
    let directives = [

      // Angular
      NgFor, NgIf, formDirectives,
      NgSwitch, NgSwitchWhen,

      // Content
      Aside, Content, Refresher,
      List, Item,
      Slides, Slide, SlidePager,
      Tabs, Tab,

      // Overlays
      ActionMenu,

      // Media
      Icon,

      // Form elements
      Checkbox, Switch, Label, Input, Segment, SegmentButton,
      RadioGroup, RadioButton, SearchBar,

      // Nav
      Nav, NavbarTemplate, Navbar, NavPush, NavPop
    ];

    config.directives = (config.directives || []).concat(directives);
    super(config);
  }
}
