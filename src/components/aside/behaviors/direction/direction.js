import {asideConfig} from '../../aside';
import Hammer from 'hammer';
import * as util from '../../../../util';

asideConfig
  .behavior(function() {
    if (this.side !== 'bottom') return;

    this.gesture.options({
      direction: Hammer.DIRECTION_VERTICAL
    });
    this.domElement.classList.add('bottom');
    util.extend(this.dragMethods, {
      canStart: ev => {
        return this.isOpen || ev.center.y > window.innerHeight - this.dragThreshold;
      },
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
  })
  .behavior(function() {
    if (this.side !== 'left') return;


    this.domElement.classList.add('left');
    this.gesture.options({
      direction: Hammer.DIRECTION_HORIZONTAL
    });
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
    })

  })
  .behavior(function() {
    if (this.side !== 'right') return;

    this.domElement.classList.add('right');
    this.gesture.options({
      direction: Hammer.DIRECTION_HORIZONTAL
    });
    util.extend(this.dragMethods, {
      canStart: ev => {
        return this.isOpen || ev.center.x > window.innerWidth - this.dragThreshold;
      },
      getMenuStart: (drag, ev) => {
        return this.isOpen ?  -drag.width : 0;
      },
      onDrag: (drag, ev) => {
        drag.pos = util.clamp(
          0, -drag.menuStart + drag.pointerStart - ev.center.x, drag.width
        );
        this.domElement.style.transform = 'translate3d(' +
          (drag.width - drag.pos) + 'px,0,0)';
      },
      onEnd: (drag, ev) => {
        this.setOpen(drag.pos > drag.width / 2);
        this.domElement.style.transform = '';
      }
    });

  })
  .behavior(function() {
    if (this.side !== 'top') return;

    this.domElement.classList.add('top');
    util.extend(this.dragMethods, {
      canStart: ev => {
        return this.isOpen || ev.center.y < this.dragThreshold * 5;
      },
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
