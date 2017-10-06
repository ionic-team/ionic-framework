
import { PanRecognizer } from '../recognizers';
import { Simulate } from '../simulator';

describe('recognizers', () => {
  it('should not fire if it did not start', () => {
    let p = new PanRecognizer('x', 2, 2);
    expect(p.pan()).toEqual(0);

    Simulate.from(0, 0).to(99, 0).run((coord: any) => {
      expect(p.detect(coord)).toEqual(false);
    });
  });

  it('should reset', () => {
    let p = new PanRecognizer('x', 2, 2);

    p.start({ x: 0, y: 0 });
    expect(p.pan()).toEqual(0);

    Simulate.from(0, 0).to(10, 0).run((coord: any) => {
      p.detect(coord);
    });
    expect(p.pan()).toEqual(1);

    p.start({ x: 0, y: 0 });
    expect(p.pan()).toEqual(0);

    Simulate.from(0, 0).to(-10, 0).run((coord: any) => {
      p.detect(coord);
    });
    expect(p.pan()).toEqual(-1);
  });

  it('should fire with large threshold', () => {
    let detected = false;
    let p = new PanRecognizer('x', 100, 40);
    p.start({ x: 0, y: 0 });

    Simulate
      .from(0, 0).to(99, 0)
      // Since threshold is 100, it should not fire yet
      .run((coord: any) => expect(p.detect(coord)).toEqual(false))

      // Now it should fire
      .delta(2, 0)
      .run((coord: any) => {
        if (p.detect(coord)) {
          // it should detect a horizontal pan
          expect(p.pan()).toEqual(1);
          detected = true;
        }
      })

      // It should not detect again
      .delta(20, 0)
      .to(0, 0)
      .to(102, 0)
      .run((coord: any) => expect(p.detect(coord)).toEqual(false));

    expect(detected).toEqual(true);
  });

  it('should detect swipe left', () => {
    let p = new PanRecognizer('x', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(19, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(1);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(-19, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(1);
  });

  it('should detect swipe right', () => {
    let p = new PanRecognizer('x', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(180 - 19, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(-1);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(180 + 19, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(-1);
  });

  it('should NOT detect swipe left', () => {
    let p = new PanRecognizer('x', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(21, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(-21, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);
  });

  it('should NOT detect swipe right', () => {
    let p = new PanRecognizer('x', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(180 - 21, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(180 + 21, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);
  });



  it('should detect swipe top', () => {
    let p = new PanRecognizer('y', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(90 - 19, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(1);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(90 + 19, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(1);
  });

  it('should detect swipe bottom', () => {
    let p = new PanRecognizer('y', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(-90 + 19, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(-1);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(-90 - 19, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(-1);
  });

  it('should NOT detect swipe top', () => {
    let p = new PanRecognizer('y', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(90 - 21, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(90 + 21, 21).delta(-30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);
  });

  it('should NOT detect swipe bottom', () => {
    let p = new PanRecognizer('y', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(-90 + 21, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);

    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(-90 - 21, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));
    expect(p.pan()).toEqual(0);
  });

  it('should NOT confuse between pan Y and X', () => {
    let p = new PanRecognizer('x', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).deltaPolar(90, 21).delta(30, 0)
      .run((coord: any) => p.detect(coord));

    expect(p.pan()).toEqual(0);
  });

  it('should NOT confuse between pan X and Y', () => {
    let p = new PanRecognizer('y', 20, 20);
    p.start({ x: 0, y: 0 });
    Simulate
      .from(0, 0).delta(30, 0)
      .run((coord: any) => p.detect(coord));

    expect(p.pan()).toEqual(0);
  });
});
