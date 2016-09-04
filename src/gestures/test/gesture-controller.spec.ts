import { GestureController, DisableScroll } from '../gesture-controller';

describe('gesture controller', () => {
  it('should create an instance of GestureController', () => {
    let c = new GestureController(null);
    expect(c.isCaptured()).toEqual(false);
    expect(c.isScrollDisabled()).toEqual(false);
  });

  it('should test scrolling enable/disable stack', () => {
    let c = new GestureController(null);
    c.enableScroll(1);
    expect(c.isScrollDisabled()).toEqual(false);

    c.disableScroll(1);
    expect(c.isScrollDisabled()).toEqual(true);
    c.disableScroll(1);
    c.disableScroll(1);
    expect(c.isScrollDisabled()).toEqual(true);

    c.enableScroll(1);
    expect(c.isScrollDisabled()).toEqual(false);

    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
        c.disableScroll(j);
      }
    }

    for (var i = 0; i < 100; i++) {
      expect(c.isScrollDisabled()).toEqual(true);
      c.enableScroll(50 - i);
      c.enableScroll(i);
    }
    expect(c.isScrollDisabled()).toEqual(false);
  });

  it('should test gesture enable/disable stack', () => {
    let c = new GestureController(null);
    c.enableGesture('swipe', 1);
    expect(c.isDisabled('swipe')).toEqual(false);

    c.disableGesture('swipe', 1);
    expect(c.isDisabled('swipe')).toEqual(true);
    c.disableGesture('swipe', 1);
    c.disableGesture('swipe', 1);
    expect(c.isDisabled('swipe')).toEqual(true);

    c.enableGesture('swipe', 1);
    expect(c.isDisabled('swipe')).toEqual(false);

    // Disabling gestures multiple times
    for (var gestureName = 0; gestureName < 10; gestureName++) {
      for (var i = 0; i < 50; i++) {
        for (var j = 0; j < 50; j++) {
          c.disableGesture(gestureName.toString(), j);
        }
      }
    }

    for (var gestureName = 0; gestureName < 10; gestureName++) {
      for (var i = 0; i < 49; i++) {
        c.enableGesture(gestureName.toString(), i);
      }
      expect(c.isDisabled(gestureName.toString())).toEqual(true);
      c.enableGesture(gestureName.toString(), 49);
      expect(c.isDisabled(gestureName.toString())).toEqual(false);
    }
  });


  it('should test if canStart', () => {
    let c = new GestureController(null);
    expect(c.canStart('event')).toEqual(true);
    expect(c.canStart('event1')).toEqual(true);
    expect(c.canStart('event')).toEqual(true);
    expect(c['requestedStart']).toEqual({});
    expect(c.isCaptured()).toEqual(false);
  });



  it('should initialize a delegate without options', () => {
    let c = new GestureController(null);
    let g = c.create('event');
    expect(g['name']).toEqual('event');
    expect(g.priority).toEqual(0);
    expect(g['disable']).toEqual([]);
    expect(g['disableScroll']).toEqual(DisableScroll.Never);
    expect(g['controller']).toEqual(c);
    expect(g['id']).toEqual(1);

    let g2 = c.create('event2');
    expect(g2['id']).toEqual(2);
  });


  it('should initialize a delegate with options', () => {
    let c = new GestureController(null);
    let g = c.create('swipe', {
      priority: -123,
      disableScroll: DisableScroll.DuringCapture,
      disable: ['event2']
    });
    expect(g['name']).toEqual('swipe');
    expect(g.priority).toEqual(-123);
    expect(g['disable']).toEqual(['event2']);
    expect(g['disableScroll']).toEqual(DisableScroll.DuringCapture);
    expect(g['controller']).toEqual(c);
    expect(g['id']).toEqual(1);
  });

  it('should test if several gestures can be started', () => {
    let c = new GestureController(null);
    let g1 = c.create('swipe');
    let g2 = c.create('swipe1', {priority: 3});
    let g3 = c.create('swipe2', {priority: 4});

    for (var i = 0; i < 10; i++) {
      expect(g1.start()).toEqual(true);
      expect(g2.start()).toEqual(true);
      expect(g3.start()).toEqual(true);
    }
    expect(c['requestedStart']).toEqual({
      1: 0,
      2: 3,
      3: 4
    });

    g1.release();
    g1.release();

    expect(c['requestedStart']).toEqual({
      2: 3,
      3: 4
    });
    expect(g1.start()).toEqual(true);
    expect(g2.start()).toEqual(true);
    g3.destroy();

    expect(c['requestedStart']).toEqual({
      1: 0,
      2: 3,
    });
  });


  it('should test if several gestures try to capture at the same time', () => {
    let c = new GestureController(null);
    let g1 = c.create('swipe1');
    let g2 = c.create('swipe2', { priority: 2 });
    let g3 = c.create('swipe3', { priority: 3 });
    let g4 = c.create('swipe4', { priority: 4 });
    let g5 = c.create('swipe5', { priority: 5 });

    // Low priority capture() returns false
    expect(g2.start()).toEqual(true);
    expect(g3.start()).toEqual(true);
    expect(g1.capture()).toEqual(false);
    expect(c['requestedStart']).toEqual({
      2: 2,
      3: 3
    });

    // Low priority start() + capture() returns false
    expect(g2.capture()).toEqual(false);
    expect(c['requestedStart']).toEqual({
      3: 3
    });

    // Higher priority capture() return true
    expect(g4.capture()).toEqual(true);
    expect(c.isScrollDisabled()).toEqual(false);
    expect(c.isCaptured()).toEqual(true);
    expect(c['requestedStart']).toEqual({});

    // Higher priority can not capture because it is already capture
    expect(g5.capture()).toEqual(false);
    expect(g5.canStart()).toEqual(false);
    expect(g5.start()).toEqual(false);
    expect(c['requestedStart']).toEqual({});

    // Only captured gesture can release
    g1.release();
    g2.release();
    g3.release();
    g5.release();
    expect(c.isCaptured()).toEqual(true);

    // G4 releases
    g4.release();
    expect(c.isCaptured()).toEqual(false);

    // Once it was release, any gesture can capture
    expect(g1.start()).toEqual(true);
    expect(g1.capture()).toEqual(true);
  });


  it('should destroy correctly', () => {
    let c = new GestureController(null);
    let g = c.create('swipe', {
      priority: 123,
      disableScroll: DisableScroll.Always,
      disable: ['event2']
    });
    expect(c.isScrollDisabled()).toEqual(true);

    // Capturing
    expect(g.capture()).toEqual(true);
    expect(c.isCaptured()).toEqual(true);
    expect(g.capture()).toEqual(false);
    expect(c.isScrollDisabled()).toEqual(true);

    // Releasing
    g.release();
    expect(c.isCaptured()).toEqual(false);
    expect(c.isScrollDisabled()).toEqual(true);
    expect(g.capture()).toEqual(true);
    expect(c.isCaptured()).toEqual(true);

    // Destroying
    g.destroy();
    expect(c.isCaptured()).toEqual(false);
    expect(g['controller']).toBeNull();

    // it should return false and not crash
    expect(g.start()).toEqual(false);
    expect(g.capture()).toEqual(false);
    g.release();
  });


  it('should disable some events', () => {
    let c = new GestureController(null);

    let goback = c.create('goback');
    expect(goback.canStart()).toEqual(true);

    let g2 = c.create('goback2');
    expect(g2.canStart()).toEqual(true);

    let g3 = c.create('swipe', {
      disable: ['range', 'goback', 'something']
    });

    let g4 = c.create('swipe2', {
      disable: ['range']
    });

    // it should be noop
    g3.release();

    // goback is disabled
    expect(c.isDisabled('range')).toEqual(true);
    expect(c.isDisabled('goback')).toEqual(true);
    expect(c.isDisabled('something')).toEqual(true);
    expect(c.isDisabled('goback2')).toEqual(false);
    expect(goback.canStart()).toEqual(false);
    expect(goback.start()).toEqual(false);
    expect(goback.capture()).toEqual(false);
    expect(g3.canStart()).toEqual(true);

    // Once g3 is destroyed, goback and something should be enabled
    g3.destroy();
    expect(c.isDisabled('range')).toEqual(true);
    expect(c.isDisabled('goback')).toEqual(false);
    expect(c.isDisabled('something')).toEqual(false);
    expect(g3.canStart()).toEqual(false);

    // Once g4 is destroyed, range is also enabled
    g4.destroy();
    expect(c.isDisabled('range')).toEqual(false);
    expect(g4.canStart()).toEqual(false);
  });

  it('should disable scrolling on capture', () => {
    let c = new GestureController(null);
    let g = c.create('goback', {
      disableScroll: DisableScroll.DuringCapture,
    });
    let g1 = c.create('swipe');

    g.start();
    expect(c.isScrollDisabled()).toEqual(false);

    g1.capture();
    g.capture();
    expect(c.isScrollDisabled()).toEqual(false);

    g1.release();
    expect(c.isScrollDisabled()).toEqual(false);

    g.capture();
    expect(c.isScrollDisabled()).toEqual(true);

    let g2 = c.create('swipe2', {
      disableScroll: DisableScroll.Always,
    });
    g.release();
    expect(c.isScrollDisabled()).toEqual(true);

    g2.destroy();
    expect(c.isScrollDisabled()).toEqual(false);

    g.capture();
    expect(c.isScrollDisabled()).toEqual(true);

    g.destroy();
    expect(c.isScrollDisabled()).toEqual(false);
  });
});
