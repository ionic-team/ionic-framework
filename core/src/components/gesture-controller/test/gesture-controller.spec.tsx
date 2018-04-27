import { GestureController, } from '../gesture-controller';

describe('gesture controller', () => {

  it('should create an instance of GestureController', () => {
    const c = new GestureController();
    expect(c.isCaptured()).toEqual(false);
    expect(c.isScrollDisabled()).toEqual(false);
  });

  it('should test scrolling enable/disable stack', () => {
    const c = new GestureController();
    c.enableScroll(1);
    expect(c.isScrollDisabled()).toEqual(false);

    c.disableScroll(1);
    expect(c.isScrollDisabled()).toEqual(true);
    c.disableScroll(1);
    c.disableScroll(1);
    expect(c.isScrollDisabled()).toEqual(true);

    c.enableScroll(1);
    expect(c.isScrollDisabled()).toEqual(false);

    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        c.disableScroll(j);
      }
    }

    for (let i = 0; i < 100; i++) {
      expect(c.isScrollDisabled()).toEqual(true);
      c.enableScroll(50 - i);
      c.enableScroll(i);
    }
    expect(c.isScrollDisabled()).toEqual(false);
  });

  it('should test gesture enable/disable stack', () => {
    const c = new GestureController();
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
    for (let gestureName = 0; gestureName < 10; gestureName++) {
      for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {
          c.disableGesture(gestureName.toString(), j);
        }
      }
    }

    for (let gestureName = 0; gestureName < 10; gestureName++) {
      for (let i = 0; i < 49; i++) {
        c.enableGesture(gestureName.toString(), i);
      }
      expect(c.isDisabled(gestureName.toString())).toEqual(true);
      c.enableGesture(gestureName.toString(), 49);
      expect(c.isDisabled(gestureName.toString())).toEqual(false);
    }
  });


  it('should test if canStart', () => {
    const c = new GestureController();
    expect(c.canStart('event')).toEqual(true);
    expect(c.canStart('event1')).toEqual(true);
    expect(c.canStart('event')).toEqual(true);
    expect(c['requestedStart'].size).toEqual(0);
    expect(c.isCaptured()).toEqual(false);
  });

  it('should initialize without options', async () => {
    const c = new GestureController();

    const g = await c.create({
      name: 'event',
    });
    expect(g['name']).toEqual('event');
    expect(g['priority']).toEqual(0);
    expect(g['disableScroll']).toEqual(false);
    expect(g['ctrl']).toEqual(c);
    expect(g['id']).toEqual(1);

    const g2 = await c.create({ name: 'event2' });
    expect(g2['id']).toEqual(2);
  });

  it('should initialize without options', async () => {
    const c = new GestureController();

    const g = await c.create({
      name: 'event',
    });
    const g2 = await c.create({
      name: 'event2',
    });
    expect(g['id']).toEqual(1);
    expect(g2['id']).toEqual(2);
  });


  it('should initialize a delegate with options', async () => {
    const c = new GestureController();
    const g = await c.create({
      name: 'swipe',
      priority: -123,
      disableScroll: true,
    });
    expect(g['name']).toEqual('swipe');
    expect(g['priority']).toEqual(-123);
    expect(g['disableScroll']).toEqual(true);
    expect(g['ctrl']).toEqual(c);
    expect(g['id']).toEqual(1);
  });

  it('should test if several gestures can be started', async () => {
    const c = new GestureController();
    const g1 = await c.create({name: 'swipe' });
    const g2 = await c.create({name: 'swipe1', priority: 3});
    const g3 = await c.create({name: 'swipe2', priority: 4});

    for (let i = 0; i < 10; i++) {
      expect(g1.start()).toEqual(true);
      expect(g2.start()).toEqual(true);
      expect(g3.start()).toEqual(true);
    }
    const expected = new Map();
    expected.set(1, 0);
    expected.set(2, 3);
    expected.set(3, 4);
    expect(c['requestedStart']).toEqual(expected);

    g1.release();
    g1.release();

    const expected2 = new Map();
    expected2.set(2, 3);
    expected2.set(3, 4);
    expect(c['requestedStart']).toEqual(expected2);

    expect(g1.start()).toEqual(true);
    expect(g2.start()).toEqual(true);
    g3.destroy();
    expect(g3['ctrl']).toBeUndefined();

    const expected3 = new Map();
    expected3.set(1, 0);
    expected3.set(2, 3);
    expect(c['requestedStart']).toEqual(expected3);
  });


  it('should test if several gestures try to capture at the same time', async () => {
    const c = new GestureController();
    const g1 = await c.create({name: 'swipe1'});
    const g2 = await c.create({name: 'swipe2', priority: 2 });
    const g3 = await c.create({name: 'swipe3', priority: 3 });
    const g4 = await c.create({name: 'swipe4', priority: 4 });
    const g5 = await c.create({name: 'swipe5', priority: 5 });

    // Low priority capture() returns false
    expect(g2.start()).toEqual(true);
    expect(g3.start()).toEqual(true);
    expect(g1.capture()).toEqual(false);

    const expected = new Map();
    expected.set(2, 2);
    expected.set(3, 3);
    expect(c['requestedStart']).toEqual(expected);

    // Low priority start() + capture() returns false
    expect(g2.capture()).toEqual(false);

    const expected2 = new Map();
    expected2.set(3, 3);
    expect(c['requestedStart']).toEqual(expected2);

    // Higher priority capture() return true
    expect(g4.capture()).toEqual(true);

    expect(c.isScrollDisabled()).toEqual(false);
    expect(c.isCaptured()).toEqual(true);
    expect(c['requestedStart']).toEqual(new Map());

    // Higher priority can not capture because it is already capture
    expect(g5.capture()).toEqual(false);
    expect(g5.canStart()).toEqual(false);
    expect(g5.start()).toEqual(false);
    expect(c['requestedStart']).toEqual(new Map());

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

  it('should disable scrolling on capture', async () => {
    const c = new GestureController();
    const g = await c.create({
      name: 'goback',
      disableScroll: true,
    });
    const g1 = await c.create({ name: 'swipe' });

    g.start();
    expect(c.isScrollDisabled()).toEqual(false);

    g1.capture();
    g.capture();
    expect(c.isScrollDisabled()).toEqual(false);

    g1.release();
    expect(c.isScrollDisabled()).toEqual(false);

    g.capture();
    expect(c.isScrollDisabled()).toEqual(true);

    g.destroy();
    expect(c.isScrollDisabled()).toEqual(false);
  });

  describe('BlockerDelegate', () => {
    it('create one', async () => {
      const c = new GestureController();
      const b = c.createBlocker({
        disableScroll: true,
        disable: ['event1', 'event2', 'event3', 'event4']
      });

      expect(b['disable']).toEqual(['event1', 'event2', 'event3', 'event4']);
      expect(b['disableScroll']).toEqual(true);
      expect(b['ctrl']).toEqual(c);
      expect(b['id']).toEqual(1);

      const b2 = c.createBlocker({
        disable: ['event2', 'event3', 'event4', 'event5']
      });

      expect(b2['disable']).toEqual(['event2', 'event3', 'event4', 'event5']);
      expect(b2['disableScroll']).toEqual(false);
      expect(b2['ctrl']).toEqual(c);
      expect(b2['id']).toEqual(2);


      expect(c.isDisabled('event1')).toBeFalsy();
      expect(c.isDisabled('event2')).toBeFalsy();
      expect(c.isDisabled('event3')).toBeFalsy();
      expect(c.isDisabled('event4')).toBeFalsy();
      expect(c.isDisabled('event5')).toBeFalsy();

      b.block();
      b.block();

      expect(c.isDisabled('event1')).toBeTruthy();
      expect(c.isDisabled('event2')).toBeTruthy();
      expect(c.isDisabled('event3')).toBeTruthy();
      expect(c.isDisabled('event4')).toBeTruthy();
      expect(c.isDisabled('event5')).toBeFalsy();

      b2.block();
      b2.block();
      b2.block();

      expect(c.isDisabled('event1')).toBeTruthy();
      expect(c.isDisabled('event2')).toBeTruthy();
      expect(c.isDisabled('event3')).toBeTruthy();
      expect(c.isDisabled('event4')).toBeTruthy();
      expect(c.isDisabled('event5')).toBeTruthy();

      b.unblock();

      expect(c.isDisabled('event1')).toBeFalsy();
      expect(c.isDisabled('event2')).toBeTruthy();
      expect(c.isDisabled('event3')).toBeTruthy();
      expect(c.isDisabled('event4')).toBeTruthy();
      expect(c.isDisabled('event5')).toBeTruthy();

      b2.destroy();
      expect(b2['ctrl']).toBeUndefined();

      expect(c.isDisabled('event1')).toBeFalsy();
      expect(c.isDisabled('event2')).toBeFalsy();
      expect(c.isDisabled('event3')).toBeFalsy();
      expect(c.isDisabled('event4')).toBeFalsy();
      expect(c.isDisabled('event5')).toBeFalsy();
    });


    it('should disable some events', async () => {
      const c = new GestureController();

      const goback = await c.create({ name: 'goback' });
      expect(goback.canStart()).toEqual(true);

      const g2 = await c.create({ name: 'goback2' });
      expect(g2.canStart()).toEqual(true);

      const g3 = c.createBlocker({
        disable: ['range', 'goback', 'something']
      });

      const g4 = c.createBlocker({
        disable: ['range']
      });

      g3.block();
      g4.block();

      // goback is disabled
      expect(c.isDisabled('range')).toEqual(true);
      expect(c.isDisabled('goback')).toEqual(true);
      expect(c.isDisabled('something')).toEqual(true);
      expect(c.isDisabled('goback2')).toEqual(false);
      expect(goback.canStart()).toEqual(false);
      expect(goback.start()).toEqual(false);
      expect(goback.capture()).toEqual(false);

      // Once g3 is destroyed, goback and something should be enabled
      g3.destroy();
      expect(c.isDisabled('range')).toEqual(true);
      expect(c.isDisabled('goback')).toEqual(false);
      expect(c.isDisabled('something')).toEqual(false);

      // Once g4 is destroyed, range is also enabled
      g4.unblock();
      expect(c.isDisabled('range')).toEqual(false);
    });
  });
});
