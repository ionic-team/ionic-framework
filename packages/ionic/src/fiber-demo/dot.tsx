import { Component, Prop, h, State } from '../index';
import { VNodeData } from '../../util/interfaces';

@Component({
  tag: 'fiber-dot'
})
export class FiberDot {
  @Prop() size: number;
  @Prop() x: number;
  @Prop() y: number;
  @Prop() text: string;

  @State() hover: boolean = false;

  enter() {
    this.hover = true;
  }

  leave() {
    this.hover = false;
  }

  hostData(): VNodeData {
    const s = this.size * 1.3;
    const style = {
      position: 'absolute',
      font: 'normal 15px sans-serif',
      textAlign: 'center',
      cursor: 'pointer',
      width: s + 'px',
      height: s + 'px',
      left: (this.x) + 'px',
      top: (this.y) + 'px',
      borderRadius: (s / 2) + 'px',
      lineHeight: (s) + 'px',
      background: this.hover ? '#ff0' : '#61dafb'
    };

    return {
      style: style,
      on: {
        mouseenter: this.enter.bind(this),
        mouseleave: this.leave.bind(this)
      },
    };
  }

  render() {
    return (
      this.hover ? '**' + this.text + '**' : this.text
    );
  }
}
