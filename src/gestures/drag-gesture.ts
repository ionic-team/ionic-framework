import { Gesture } from './gesture';
import { defaults } from '../util';

/**
 * @private
 */

export class DragGesture extends Gesture {
  public dragging: boolean;

  constructor(element: HTMLElement, opts = {}) {
    defaults(opts, {});
    super(element, opts);
  }

  listen() {
    super.listen();

    this.on('panstart', (ev: UIEvent) => {
      if (this.onDragStart(ev) !== false) {
        this.dragging = true;
      }
    });

    this.on('panmove', (ev: UIEvent) => {
      if (!this.dragging) return;
      if (this.onDrag(ev) === false) {
        this.dragging = false;
      }
    });

    this.on('panend', (ev: UIEvent) => {
      if (!this.dragging) return;
      this.onDragEnd(ev);
      this.dragging = false;
    });
  }

  onDrag(ev: any): boolean { return true; }
  onDragStart(ev: any): boolean { return true; }
  onDragEnd(ev: any): void {}
}
