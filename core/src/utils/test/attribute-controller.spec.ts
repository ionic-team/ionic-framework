import { win } from '@utils/browser';

import { createAttributeController, createAriaAttributeController } from '../attribute-controller';

/**
 * There is no `MutationObserver` in mock-doc, so the observer half of the controller is
 * only reachable from a spec through a stub. This one records what each instance was
 * asked to observe and lets the test drive the callback by hand.
 */
class MockMutationObserver {
  static instances: MockMutationObserver[] = [];

  observedFilter: string[] | undefined;
  connected = false;

  constructor(private callback: (mutations: { attributeName: string }[]) => void) {
    MockMutationObserver.instances.push(this);
  }

  observe(_el: Node, options: { attributeFilter?: string[] }) {
    this.observedFilter = options.attributeFilter;
    this.connected = true;
  }

  disconnect() {
    this.connected = false;
  }

  /** Stands in for the browser delivering an attribute mutation. */
  emit(...attributeNames: string[]) {
    this.callback(attributeNames.map((attributeName) => ({ attributeName })));
  }

  static get live() {
    return MockMutationObserver.instances.filter((instance) => instance.connected);
  }

  static get latest() {
    return MockMutationObserver.instances[MockMutationObserver.instances.length - 1];
  }
}

/**
 * The controller gates on `'MutationObserver' in win` but constructs the global, so the
 * stub has to go in both places. mock-doc defines neither, so teardown deletes the keys
 * instead of restoring a value, because that check has to read false again for the
 * unavailable-environment test.
 */
const installMockMutationObserver = () => {
  MockMutationObserver.instances = [];
  (globalThis as any).MutationObserver = MockMutationObserver;
  (win as any).MutationObserver = MockMutationObserver;
};

const restoreOverrides = () => {
  delete (globalThis as any).MutationObserver;
  delete (win as any).MutationObserver;
};

const createHost = (attributes: Record<string, string> = {}) => {
  const el = document.createElement('div');
  Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value));
  return el;
};

describe('createAttributeController()', () => {
  beforeEach(installMockMutationObserver);

  afterEach(restoreOverrides);

  it('should copy the attributes off the host on creation', () => {
    const el = createHost({ 'aria-label': 'Save', 'aria-describedby': 'hint' });

    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(el.hasAttribute('aria-label')).toBe(false);
    // Attributes outside the set are left alone.
    expect(el.getAttribute('aria-describedby')).toBe('hint');
  });

  it('should start watching on creation', () => {
    createAttributeController(createHost(), ['aria-label'], jest.fn());

    expect(MockMutationObserver.live).toHaveLength(1);
    expect(MockMutationObserver.latest.observedFilter).toEqual(['aria-label']);
  });

  it('should apply a later attribute change', () => {
    const el = createHost({ 'aria-label': 'Save' });
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    el.setAttribute('aria-label', 'Submit');
    MockMutationObserver.latest.emit('aria-label');

    expect(controller.attributes).toEqual({ 'aria-label': 'Submit' });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should clear an attribute that is removed after load', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.emit('aria-label');
    el.removeAttribute('aria-label');
    MockMutationObserver.latest.emit('aria-label');

    expect(controller.attributes['aria-label']).toBeNull();
  });

  it('should not watch host owned attributes', () => {
    const el = createHost({ 'aria-label': 'Save', 'aria-disabled': 'true' });

    const controller = createAttributeController(el, ['aria-label', 'aria-disabled'], jest.fn(), ['aria-disabled']);

    // Still copied at load, just never watched afterwards.
    expect(controller.attributes).toEqual({ 'aria-label': 'Save', 'aria-disabled': 'true' });
    expect(MockMutationObserver.latest.observedFilter).toEqual(['aria-label']);
  });

  it('should not observe when every attribute is host owned', () => {
    createAttributeController(createHost(), ['aria-disabled'], jest.fn(), ['aria-disabled']);

    expect(MockMutationObserver.instances).toHaveLength(0);
  });

  it('should stop watching on destroy', () => {
    const controller = createAttributeController(createHost(), ['aria-label'], jest.fn());

    controller.destroy();

    expect(MockMutationObserver.live).toHaveLength(0);
  });

  it('should not stack observers when init is called while already watching', () => {
    const controller = createAttributeController(createHost(), ['aria-label'], jest.fn());

    controller.init();

    expect(MockMutationObserver.live).toHaveLength(1);
  });

  it('should resume watching after destroy', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    controller.destroy();
    controller.init();

    el.setAttribute('aria-label', 'Submit');
    MockMutationObserver.latest.emit('aria-label');

    expect(controller.attributes).toEqual({ 'aria-label': 'Submit' });
  });

  it('should pick up a change made while not watching', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    controller.destroy();
    el.setAttribute('aria-label', 'Submit');
    controller.init();

    expect(controller.attributes).toEqual({ 'aria-label': 'Submit' });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should clear an attribute removed while not watching', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    el.setAttribute('aria-label', 'Submit');
    MockMutationObserver.latest.emit('aria-label');

    controller.destroy();
    el.removeAttribute('aria-label');
    controller.init();

    expect(controller.attributes['aria-label']).toBeNull();
  });

  it('should track a detached write of an unchanged value, so a later removal is seen', () => {
    const el = createHost({ 'aria-label': 'Save' });
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    // Re-setting the value the copy already captured puts the attribute back on the
    // host, even though nothing about the rendered value changed.
    controller.destroy();
    el.setAttribute('aria-label', 'Save');
    controller.init();

    controller.destroy();
    el.removeAttribute('aria-label');
    controller.init();

    expect(controller.attributes['aria-label']).toBeNull();
  });

  it('should not re-render when a detached write matches the current value', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.emit('aria-label');
    onChange.mockClear();

    controller.destroy();
    controller.init();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should apply every attribute in one mutation batch with a single re-render', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label', 'aria-description'], onChange);

    el.setAttribute('aria-label', 'Save');
    el.setAttribute('aria-description', 'Saves the draft');
    MockMutationObserver.latest.emit('aria-label', 'aria-description');

    expect(controller.attributes).toEqual({ 'aria-label': 'Save', 'aria-description': 'Saves the draft' });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should still copy when MutationObserver is unavailable', () => {
    // Neither the hydrate build nor mock-doc has a `MutationObserver`.
    restoreOverrides();
    const el = createHost({ 'aria-label': 'Save' });

    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(() => {
      controller.init();
      controller.destroy();
    }).not.toThrow();
  });

  it('should keep the initial copy when resuming, since the copy removed it from the host', () => {
    const el = createHost({ 'aria-label': 'Save' });
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    controller.destroy();
    controller.init();

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('createAriaAttributeController()', () => {
  beforeEach(installMockMutationObserver);

  afterEach(restoreOverrides);

  it('should copy and watch every aria attribute and role', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Save');
    el.setAttribute('role', 'button');
    el.setAttribute('title', 'not aria');

    const controller = createAriaAttributeController(el, jest.fn());

    expect(controller.attributes).toEqual({ 'aria-label': 'Save', role: 'button' });
    expect(el.getAttribute('title')).toBe('not aria');
    expect(MockMutationObserver.latest.observedFilter).toContain('aria-description');
    expect(MockMutationObserver.latest.observedFilter).toContain('role');
  });

  it('should exclude host owned attributes from the watch only', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-disabled', 'true');

    const controller = createAriaAttributeController(el, jest.fn(), ['aria-disabled']);

    expect(controller.attributes).toEqual({ 'aria-disabled': 'true' });
    expect(MockMutationObserver.latest.observedFilter).not.toContain('aria-disabled');
  });
});
