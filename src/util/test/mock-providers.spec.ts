import { MockPlatform, mockPlatform } from '../mock-providers';
import { MockDomController, mockDomController } from '../mock-providers';

describe('mock-providers', () => {

  describe('MockDomController', () => {

    it('should schedule a raf after a timeout', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };
      let callback3 = () => { callOrder.push(3); };
      let callback4 = () => { callOrder.push(4); };

      dom.read(callback1, 10);
      dom.read(callback2, 20);
      dom.read(callback3, 30);
      dom.read(callback4, 40);

      dom.flushUntil(30, () => {
        expect(callOrder).toEqual([1, 2]);
        callOrder.length = 0;

        dom.flushUntil(50, () => {
          expect(callOrder).toEqual([3, 4]);
          done();
        });
      });
    });

    it('should schedule a raf with a timeout', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };

      dom.read(callback1, 10);
      dom.write(callback2, 20);

      dom.flush(() => {
        expect(callOrder).toEqual([1, 2]);
        done();
      });
    });

    it('should cancel read/write that have timeouts', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };

      let readId = dom.read(callback1, 100);
      let writeId = dom.write(callback2, 100);

      dom.cancel(readId);
      dom.cancel(writeId);

      dom.flush(() => {
        expect(callOrder).toEqual([]);
        done();
      });
    });

    it('should cancel read/write', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };

      let readId = dom.read(callback1);
      let writeId = dom.write(callback2);

      dom.cancel(readId);
      dom.cancel(writeId);

      dom.flush(() => {
        expect(callOrder).toEqual([]);
        done();
      });
    });

    it('should schedule a read/write', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };
      let callback3 = () => { callOrder.push(3); };
      let callback4 = () => { callOrder.push(4); };

      dom.read(callback1);
      dom.write(callback4);
      dom.write(callback2);
      dom.read(callback3);

      dom.flush(() => {
        expect(callOrder).toEqual([1, 3, 4, 2]);
        done();
      });
    });

    let dom: MockDomController;
    beforeEach(() => {
      dom = mockDomController();
    });

  });

  describe('MockPlatform', () => {

    it('should cancel raf by id', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };
      let callback3 = () => { callOrder.push(3); };

      plt.raf(callback1);
      let tmr2 = plt.raf(callback2);
      plt.raf(callback3);

      plt.cancelRaf(tmr2);

      plt.flushRafs(() => {
        expect(callOrder).toEqual([1, 3]);
        done();
      });
    });

    it('should set rafs', (done) => {
      let callOrder: number[] = [];
      let timestamps: number[] = [];
      let callback1 = (timeStamp: number) => { callOrder.push(1); timestamps.push(timeStamp); };
      let callback2 = (timeStamp: number) => { callOrder.push(2); timestamps.push(timeStamp); };

      plt.raf(callback1);
      plt.raf(callback2);

      plt.flushRafs(() => {
        expect(callOrder).toEqual([1, 2]);
        expect(timestamps).toEqual([1, 1]);
        done();
      });
    });

    it('should flush up until timeout', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };
      let callback3 = () => { callOrder.push(3); };
      let callback4 = () => { callOrder.push(4); };

      plt.timeout(callback1, 10);
      plt.timeout(callback2, 20);
      plt.timeout(callback3, 30);
      plt.timeout(callback4, 40);

      plt.flushTimeoutsUntil(30, () => {
        expect(callOrder).toEqual([1, 2]);
        callOrder.length = 0;

        plt.flushTimeoutsUntil(50, () => {
          expect(callOrder).toEqual([3, 4]);
          done();
        });
      });
    });

    it('should cancel timeout by id', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };
      let callback3 = () => { callOrder.push(3); };

      plt.timeout(callback1, 10);
      let tmr2 = plt.timeout(callback2, 20);
      plt.timeout(callback3, 30);

      plt.cancelTimeout(tmr2);

      plt.flushTimeouts(() => {
        expect(callOrder).toEqual([1, 3]);
        done();
      });
    });

    it('should set timeouts but put them in the right order depending on timeout', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };
      let callback3 = () => { callOrder.push(3); };
      let callback4 = () => { callOrder.push(4); };

      plt.timeout(callback1, 30);
      plt.timeout(callback2, 10);
      plt.timeout(callback3, 20);
      plt.timeout(callback4, 10);

      plt.flushTimeouts(() => {
        expect(callOrder).toEqual([2, 4, 3, 1]);
        done();
      });
    });

    it('should set timeouts', (done) => {
      let callOrder: number[] = [];
      let callback1 = () => { callOrder.push(1); };
      let callback2 = () => { callOrder.push(2); };

      plt.timeout(callback1, 10);
      plt.timeout(callback2, 10);

      plt.flushTimeouts(() => {
        expect(callOrder).toEqual([1, 2]);
        done();
      });
    });

    let plt: MockPlatform;
    beforeEach(() => {
      plt = mockPlatform();
    });

  });

});
