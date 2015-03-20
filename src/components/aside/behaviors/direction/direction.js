import {asideConfig} from '../../sidemenu';
import * as util from '../../../../util';

asideConfig.when(instance => instance.side === 'bottom')
  .mixin(function() {

    this.gesture.options({
      direction: Hammer.DIRECTION_VERTICAL
    });
    this.domElement.classList.add('bottom');
    util.extend(this.dragMethods, {
      getMenuStart: (drag, ev) => {
        return this.isOpen ?  -drag.height : 0;
      },
      onDrag: (drag, ev) => {
        drag.pos = util.clamp(
          0, -drag.menuStart + drag.pointerStart - ev.center.y, drag.height
        );
        this.domElement.style.transform = 'translate3d(0,' +
          (drag.height - drag.pos) + 'px,0)';
      },
      onEnd: (drag, ev) => {
        this.setOpen(drag.pos > drag.height / 2);
        this.domElement.style.transform = '';
      },
      getEventPos: ev => {
        return ev.center.y;
      }
    });

  });

asideConfig.when(instance => instance.side === 'left')
  .mixin(function() {

    this.domElement.classList.add('left');
    util.extend(this.dragMethods, {
      canStart: (ev) => {
        return this.isOpen || ev.center.x < this.dragThreshold;
      },
      getMenuStart: (drag, ev) => {
        return this.isOpen ? drag.width : 0;
      },
      onDrag: (drag, ev) => {
        drag.pos = util.clamp(
          0, drag.menuStart + ev.center.x - drag.pointerStart, drag.width
        );
        this.domElement.style.transform = 'translate3d(' + (-drag.width + drag.pos) + 'px, 0, 0)';
      },
      onEnd: (drag, ev) => {
        this.setOpen(drag.pos > drag.width / 2);
        this.domElement.style.transform = '';
      }
    });

  });

asideConfig.when(instance => instance.side === 'right')
  .mixin(function() {

    this.domElement.classList.add('right');
    util.extend(this.dragMethods, {
      getMenuStart: (drag, ev) => {
        return this.isOpen ?  -drag.width : 0;
      },
      onDrag: (drag, ev) => {
        drag.pos = util.clamp(
          0, -drag.menuStart + drag.pointerStart - ev.center.x, drag.height
        );
        this.domElement.style.transform = 'translate3d(' +
          (drag.width - drag.pos) + 'px,0,0)';
      },
      onEnd: (drag, ev) => {
        this.setOpen(drag.pos > drag.width / 2);
        this.domElement.style.transform = '';
      }
    });

  });

asideConfig.when(instance => instance.side === 'top')
  .mixin(function() {

    this.domElement.classList.add('top');
    util.extend(this.dragMethods, {
      getMenuStart: (drag, ev) => {
        return this.isOpen ? drag.height : 0;
      },
      onDrag: (drag, ev) => {
        drag.pos = util.clamp(
          0, drag.menuStart + ev.center.y - drag.pointerStart, drag.height
        );
        this.domElement.style.transform = 'translate3d(0, ' +
          (-drag.height + drag.pos) + 'px, 0)';
      },
      onEnd: (drag, ev) => {
        this.setOpen(drag.pos > drag.height / 2);
        this.domElement.style.transform = '';
      },
      getEventPos: (ev) => {
        return ev.center.y;
      }
    });
  });
