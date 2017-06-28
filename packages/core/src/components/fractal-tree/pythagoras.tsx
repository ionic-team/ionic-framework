import { Component, h, Prop } from '@stencil/core';

declare var d3: any;

@Component({
  tag: 'pythagoras-node'
})
export class Pythagoras {

  nextRight: number;
  nextLeft: number;
  A: number;
  B: number;
  rotate: string;

  @Prop() w: number;
  @Prop() x: number;
  @Prop() y: number;
  @Prop() heightFactor: number;
  @Prop() lean: number;
  @Prop() left: number;
  @Prop() right: number;
  @Prop() lvl: number;
  @Prop() maxlvl: number;

  deg(radians: any) {
    return radians * (180 / Math.PI);
  }

  memoizedCalc(args: any) {
    const memo: any = {};

    // const key = ({ this.w, this.heightFactor, this.lean }) => [this.w, this.heightFactor, this.lean].join('-');
    const key = [args.w, args.heightFactor, args.lean].join('-');

    const memoKey = key;

    if (memo[memoKey]) {
      return memo[memoKey];
    } else {
      const { w, heightFactor, lean } = args;

      const trigH = heightFactor * w;

      const result = {
        nextRight: Math.sqrt(trigH ** 2 + (w * (.5 + lean)) ** 2),
        nextLeft: Math.sqrt(trigH ** 2 + (w * (.5 - lean)) ** 2),
        A: this.deg(Math.atan(trigH / ((.5 - lean) * w))),
        B: this.deg(Math.atan(trigH / ((.5 + lean) * w)))
      };

      memo[memoKey] = result;
      return result;
    }
  }

  calculate(): any {
    if (this.lvl >= this.maxlvl || this.w < 1) {
      return null;
    }

    const memoizedValue = this.memoizedCalc({
      w: this.w,
      heightFactor: this.heightFactor,
      lean: this.lean
    });

    this.nextRight = memoizedValue.nextRight;
    this.nextLeft = memoizedValue.nextLeft;
    this.A = memoizedValue.A;
    this.B = memoizedValue.B;

    this.rotate = '';

    if (this.left) {
      this.rotate = `rotate(${-this.A} 0 ${this.w})`;
    } else if (this.right) {
      this.rotate = `rotate(${this.B} ${this.w} ${this.w})`;
    }
  }

  ionViewWillUpdate() {
    this.calculate();
  }

  render() {
    return (
      <g transform={`translate(${this.x} ${this.y}) ${this.rotate}`}>
        <rect width={this.w} height={this.w}
          x={0} y={0}
          style={{ fill: d3.interpolateViridis(this.lvl / this.maxlvl) }} />

        <pythagoras-node w={this.nextLeft}
          x={0} y={-this.nextLeft}
          lvl={this.lvl + 1} maxlvl={this.maxlvl}
          heightFactor={this.heightFactor}
          lean={this.lean}
          left></pythagoras-node>

        <pythagoras-node w={this.nextRight}
          x={this.w - this.nextRight} y={-this.nextRight}
          lvl={this.lvl + 1} maxlvl={this.maxlvl}
          heightFactor={this.heightFactor}
          lean={this.lean}
          right></pythagoras-node>

      </g>
    );
  }
}
