import { Activator } from '../activator';
import { Config } from '../../../config/config';

describe('Activator', () => {

  it('should config css', () => {
    let activator = mockActivator(true, null);
    expect(activator._css).toEqual('activated');

    activator = mockActivator(true, 'enabled');
    expect(activator._css).toEqual('enabled');
  });

  it('should sync add/remove css class', () => {
    const {ev, ele, pos} = testValues();

    let activator = mockActivator(true, 'activo');
    activator.activatedDelay = 0;
    activator.clearDelay = 0;

    activator.downAction(ev, ele, pos);
    expect(ele.classList.contains('activo')).toBeTruthy();

    activator.upAction(ev, ele, pos);
    expect(ele.classList.contains('activo')).toBeFalsy();

    activator.downAction(ev, ele, pos);
    expect(ele.classList.contains('activo')).toBeTruthy();

    activator.upAction(null, null, pos);
    expect(ele.classList.contains('activo')).toBeFalsy();

    activator.downAction(ev, ele, pos);
    expect(ele.classList.contains('activo')).toBeTruthy();

    activator.clickAction(null, null, pos);
    expect(ele.classList.contains('activo')).toBeFalsy();
  });

  it('should async down/up/click action (normal flow)', (done) => {
    const {ev, ele, pos} = testValues();

    let activator = mockActivator(true, null);
    activator.activatedDelay = 6;
    activator.clearDelay = 6;

    activator.downAction(ev, ele, pos);
    expect(ele.classList.contains('activated')).toBeFalsy();

    // upAction
    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeTruthy();
      activator.upAction(ev, ele, pos);
      expect(ele.classList.contains('activated')).toBeTruthy();
    }, (6 + 2) * 16);

    // clickAction
    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeTruthy();
      activator.clickAction(ev, ele, pos);
      expect(ele.classList.contains('activated')).toBeTruthy();
    }, (6 + 2 + 2) * 16);

    // Read final results
    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeFalsy();
      done();
    }, (6 + 6 + 4) * 16);
  }, 10000);

  it('should async down then down', (done) => {
    const {ev, ele, pos} = testValues();

    let activator = mockActivator(true, null);
    activator.activatedDelay = 6;
    activator.clearDelay = 6;

    activator.downAction(ev, ele, pos);

    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeTruthy();
      activator.downAction(ev, ele, pos);
      expect(ele.classList.contains('activated')).toBeFalsy();
    }, (6 + 2) * 16);

    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeTruthy();
      done();
    }, (6 + 6 + 4) * 16);
  }, 10000);

  it('should async down then click', (done) => {
    const {ev, ele, pos} = testValues();

    let activator = mockActivator(true, null);
    activator.activatedDelay = 6;
    activator.clearDelay = 6;

    activator.downAction(ev, ele, pos);

    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeFalsy();
      activator.clickAction(ev, ele, pos);
      expect(ele.classList.contains('activated')).toBeTruthy();
    }, 16);

    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeFalsy();
    }, (6 + 3) * 16);

    // Check the value is stable
    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeFalsy();
      done();
    }, 20 * 16);
  }, 10000);

  it('should async down then click then down (fast clicking)', (done) => {
    const {ev, ele, pos} = testValues();

    let activator = mockActivator(true, null);
    activator.activatedDelay = 6;
    activator.clearDelay = 6;

    activator.downAction(ev, ele, pos);

    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeFalsy();
      activator.clickAction(ev, ele, pos);
      expect(ele.classList.contains('activated')).toBeTruthy();
    }, 16);

    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeTruthy();
      activator.downAction(ev, ele, pos);
      expect(ele.classList.contains('activated')).toBeFalsy();
    }, 16 * 2);

    setTimeout(() => {
      expect(ele.classList.contains('activated')).toBeTruthy();
      done();
    }, 16 * 12);

  }, 10000);


});

function testValues() {
  let parent = document.createElement('div');
  let ele = document.createElement('a');
  parent.appendChild(ele);
  return {
    ev: null,
    ele: ele,
    pos: { x: 0, y: 0 },
  };
}


function mockActivator(appEnabled: boolean, css: string) {
  let app = {
    isEnabled: () => { return appEnabled; },
  };
  let config = new Config();
  if (css) {
    config.set('activatedClass', css);
  }
  return new Activator(<any>app, config);
}
