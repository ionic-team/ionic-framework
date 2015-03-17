
import {TabbarConfig} from '/components/tabbar/tabbar';
import {Draggable} from '/behaviors/draggable';

TabbarConfig.platform('android')
  .template(require('./android-template.html'))
  .mixin(function(tabbar) {
    Draggable(tabbar);
    tabbarInstance.setAsHeader();

    tabbar.assign({
      onDragStart() {},
      onDrag() {},
      onDragEnd() {}
    });
  });

/*
  <ion-tabs config-platform-android />
*/
