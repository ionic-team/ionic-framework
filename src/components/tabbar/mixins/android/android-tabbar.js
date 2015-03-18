
import {TabbarConfig} from '../../tabbar';
// import {Draggable} from '/behaviors/draggable'

TabbarConfig.platform('android')
  .template('./android-template.html')
  .mixin(function(tabbar) {
  });

