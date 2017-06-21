import { Component, Prop, h } from '../index';

var targetSize = 25;

@Component({
  tag: 'fiber-triangle',
  shadow: false
})
export class FiberTriangle {

  @Prop() x: number;
  @Prop() y: number;
  @Prop() s: number;
  @Prop() seconds: number;

  render() {
    var s = this.s;
    if (s <= targetSize) {
      return (
        <fiber-dot
          x={this.x - (targetSize / 2)}
          y={this.y - (targetSize / 2)}
          size={targetSize}
          text={this.seconds.toString()}
        ></fiber-dot>
      );
    }
    s = s / 2;

    return [
      <fiber-triangle
        x={this.x}
        y={this.y - (s / 2)}
        s={s}
        seconds={this.seconds}
      ></fiber-triangle>,
      <fiber-triangle
        x={this.x - s}
        y={this.y + (s / 2)}
        s={s}
        seconds={this.seconds}
      ></fiber-triangle>,
      <fiber-triangle
        x={ this.x + s}
        y={this.y + (s / 2)}
        s={s}
        seconds={this.seconds}
      ></fiber-triangle>
    ];
  }
}
