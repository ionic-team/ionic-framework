
import {TabbarConfig} from '../../tabbar';
// import {Draggable} from '/behaviors/draggable'

TabbarConfig.platform('android')
  .template('./android-template.html')
  .mixin(function(tabbar) {
    // Draggable(tabbar)
    // tabbarInstance.setAsHeader()

    tabbar.assign({
      press() {
        alert('pressing from android mixin');
      }
    });
  });
