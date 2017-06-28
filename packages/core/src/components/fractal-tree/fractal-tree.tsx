import { Component, h, State } from '@stencil/core';

declare var d3: any;

@Component({
  tag: 'fractal-tree'
})
export class NewsContainer {

  svg: any = {
    width: 1280,
    height: 600
  };
  running = false;
  realMax = 11;
  mainSvg: Element;

  @State() currentMax: number = 0;
  @State() baseW: number = 80;
  @State() heightFactor: number = 0;
  @State() lean: number = 0;


  ionViewDidLoad() {
    this.mainSvg = document.querySelector('#mainSvg');
    d3.select(this.mainSvg).on('mousemove', this.onMouseMove.bind(this));

    this.next();
  }

  next() {
    if (this.currentMax < this.realMax) {
      this.currentMax = this.currentMax + 1;
      setTimeout(this.next.bind(this), 500);
    }
  }

  onMouseMove() {
    if (this.running) return;
    this.running = true;

    const [x, y] = d3.mouse(this.mainSvg),

      scaleFactor = d3.scaleLinear().domain([this.svg.height, 0])
        .range([0, .8]),

      scaleLean = d3.scaleLinear().domain([0, this.svg.width / 2, this.svg.width])
        .range([.5, 0, -.5]);

    this.heightFactor = scaleFactor(y);
    this.lean = scaleLean(x);
    this.running = false;
  }

  render() {
    return (
      <svg width={this.svg.width} height={this.svg.height} id='mainSvg'
        style={{ border: '1px solid lightgray' }}>

        <pythagoras-node w={this.baseW}
          h={this.baseW}
          heightFactor={this.heightFactor}
          lean={this.lean}
          x={this.svg.width / 2 - 40}
          y={this.svg.height - this.baseW}
          lvl={0}
          maxlvl={this.currentMax}></pythagoras-node>

      </svg>
    );
  }
}
