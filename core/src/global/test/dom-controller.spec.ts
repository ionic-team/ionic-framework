// import { DomController, createDomControllerClient } from '../dom-controller';

describe('DomController', () => {
  it('should schedule reads then writes', () => {
    // const stack: string[] = [];
    // dom.read(() => stack.push('r1'));
    // dom.read(() => {
    //   stack.push('r2');
    //   dom.read(() => stack.push('r1-2'));
    //   dom.write(() => stack.push('w1-2'));
    // });
    // dom.read(() => stack.push('r3'));

    // dom.write(() => {
    //   stack.push('w1');
    //   dom.read(() => stack.push('r2-2'));
    //   dom.write(() => stack.push('w2-2'));
    // });
    // dom.write(() => stack.push('w2'));
    // dom.write(() => stack.push('w3'));

    // expect(stack).toHaveLength(0);

    // win.doRAF(0);
    // expect(stack).toEqual(['r1', 'r2', 'r3', 'w1', 'w2', 'w3']);
  });

  // let win: any;
  // let dom: DomController;
  // beforeEach(() => {
  //   win = {
  //     requestAnimationFrame: (cb: any) => {
  //       this.cb = cb;
  //     },
  //     doRAF: (time: number) => {
  //       this.cb(time);
  //     }
  //   } as any as Window;
  //   const now = () => 1;
  //   dom = createDomControllerClient(win, now, false);
  // });
});
