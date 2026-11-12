import { win } from '@utils/browser';

import {
  createAttributeController,
  createAriaAttributeController,
  createTabindexController,
} from '../attribute-controller';

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

  /** Records the browser would deliver on the next callback. */
  queued: string[] = [];

  observe(el: HTMLElement, options: { attributeFilter?: string[] }) {
    this.observedFilter = options.attributeFilter;
    this.connected = true;

    // Like a browser, queue a record for every observed write, including the callback's own.
    const setAttribute = el.setAttribute.bind(el);
    el.setAttribute = (name: string, value: string) => {
      if (this.connected && this.observedFilter?.includes(name)) {
        this.queued.push(name);
      }
      setAttribute(name, value);
    };

    const removeAttribute = el.removeAttribute.bind(el);
    el.removeAttribute = (name: string) => {
      if (this.connected && el.hasAttribute(name) && this.observedFilter?.includes(name)) {
        this.queued.push(name);
      }
      removeAttribute(name);
    };
  }

  disconnect() {
    this.connected = false;
  }

  takeRecords() {
    const records = this.queued.map((attributeName) => ({ attributeName }));
    this.queued = [];
    return records;
  }

  /** Stands in for the browser delivering whatever records are still queued. */
  flush() {
    const names = this.queued;
    this.queued = [];
    if (names.length > 0) {
      this.emit(...names);
    }
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

  it('should apply a later attribute change and leave an empty string on the host', () => {
    const el = createHost({ 'aria-label': 'Save' });
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    el.setAttribute('aria-label', 'Submit');
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ 'aria-label': 'Submit' });
    expect(el.getAttribute('aria-label')).toBe('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not read its own empty string on the host as a change', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should clear an attribute that is removed after load', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();
    el.removeAttribute('aria-label');
    MockMutationObserver.latest.flush();

    expect(controller.attributes['aria-label']).toBeNull();
    expect(el.hasAttribute('aria-label')).toBe(false);
  });

  it('should leave a later write on the host while keepOnHost returns true', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn(), [], undefined, () => true);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(el.getAttribute('aria-label')).toBe('Save');

    el.removeAttribute('aria-label');
    MockMutationObserver.latest.flush();

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
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    controller.destroy();
    controller.init();

    el.setAttribute('aria-label', 'Submit');
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ 'aria-label': 'Submit' });
  });

  it('should pick up a change made while not watching and leave an empty string on the host', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    controller.destroy();
    el.setAttribute('aria-label', 'Submit');
    controller.init();

    expect(controller.attributes).toEqual({ 'aria-label': 'Submit' });
    expect(el.getAttribute('aria-label')).toBe('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should clear an attribute removed while not watching', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    el.setAttribute('aria-label', 'Submit');
    MockMutationObserver.latest.flush();

    controller.destroy();
    el.removeAttribute('aria-label');
    controller.init();

    expect(controller.attributes['aria-label']).toBeNull();
  });

  it('should replace a detached write of an unchanged value without re-rendering', () => {
    const el = createHost({ 'aria-label': 'Save' });
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    controller.destroy();
    el.setAttribute('aria-label', 'Save');
    controller.init();

    expect(el.getAttribute('aria-label')).toBe('');
    expect(onChange).not.toHaveBeenCalled();

    // The empty string left in its place means a later removal is still seen.
    controller.destroy();
    el.removeAttribute('aria-label');
    controller.init();

    expect(controller.attributes['aria-label']).toBeNull();
  });

  it('should not re-render on resume when nothing changed while not watching', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label'], onChange);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();
    onChange.mockClear();

    controller.destroy();
    controller.init();

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(el.getAttribute('aria-label')).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should put the copied value back on the host while not watching', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();
    controller.destroy();

    expect(el.getAttribute('aria-label')).toBe('Save');
  });

  it('should apply a write that was not delivered before destroy', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn());

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();

    el.setAttribute('aria-label', 'Submit');
    controller.destroy();
    controller.init();

    expect(controller.attributes).toEqual({ 'aria-label': 'Submit' });

    el.removeAttribute('aria-label');
    controller.destroy();
    controller.init();

    expect(controller.attributes['aria-label']).toBeNull();
    expect(el.hasAttribute('aria-label')).toBe(false);
  });

  it('should put a value back on the host when keepOnHost turns true', () => {
    const el = createHost();
    const onChange = jest.fn();
    let keep = false;
    const controller = createAttributeController(el, ['aria-label'], onChange, [], undefined, () => keep);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();
    expect(el.getAttribute('aria-label')).toBe('');
    onChange.mockClear();

    keep = true;
    controller.refresh();

    expect(el.getAttribute('aria-label')).toBe('Save');
    MockMutationObserver.latest.flush();
    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should keep the copied value through a move after refresh leaves it replaced', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn(), [], undefined, () => false);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();
    controller.refresh();

    controller.destroy();
    controller.init();

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(el.getAttribute('aria-label')).toBe('');
  });

  it('should leave an attribute that does not name the host on the host as written', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-pressed', 'aria-labelledby'], jest.fn());

    el.setAttribute('aria-pressed', 'true');
    el.setAttribute('aria-labelledby', 'label');
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ 'aria-pressed': 'true', 'aria-labelledby': 'label' });
    expect(el.getAttribute('aria-pressed')).toBe('true');
    expect(el.getAttribute('aria-labelledby')).toBe('label');
  });

  it('should not touch the host when refresh is called while not watching', () => {
    const el = createHost();
    const controller = createAttributeController(el, ['aria-label'], jest.fn(), [], undefined, () => false);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();

    controller.destroy();
    controller.refresh();
    controller.init();

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(el.getAttribute('aria-label')).toBe('');
  });

  it('should replace a value kept on the host when keepOnHost turns false', () => {
    const el = createHost();
    let keep = true;
    const controller = createAttributeController(el, ['aria-label'], jest.fn(), [], undefined, () => keep);

    el.setAttribute('aria-label', 'Save');
    MockMutationObserver.latest.flush();
    expect(el.getAttribute('aria-label')).toBe('Save');

    keep = false;
    controller.refresh();

    expect(el.getAttribute('aria-label')).toBe('');
    MockMutationObserver.latest.flush();
    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
  });

  it('should apply a write made in the same task as refresh', () => {
    const el = createHost();
    let keep = true;
    const controller = createAttributeController(el, ['aria-label'], jest.fn(), [], undefined, () => keep);

    el.setAttribute('aria-label', 'Save');
    keep = false;
    controller.refresh();
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ 'aria-label': 'Save' });
    expect(el.getAttribute('aria-label')).toBe('');
  });

  it('should apply every attribute in one mutation batch with a single re-render', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createAttributeController(el, ['aria-label', 'aria-description'], onChange);

    el.setAttribute('aria-label', 'Save');
    el.setAttribute('aria-description', 'Saves the draft');
    MockMutationObserver.latest.flush();

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

describe('createTabindexController()', () => {
  beforeEach(installMockMutationObserver);

  afterEach(restoreOverrides);

  it('should move a tabindex written after load off the host', () => {
    const el = createHost();
    const onChange = jest.fn();
    const controller = createTabindexController(el, onChange);

    el.setAttribute('tabindex', '0');
    MockMutationObserver.latest.emit('tabindex');

    expect(controller.attributes).toEqual({ tabindex: '0' });
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should move a tabindex written while not watching off the host on resume', () => {
    const el = createHost({ tabindex: '0' });
    const controller = createTabindexController(el, jest.fn());

    controller.destroy();
    el.setAttribute('tabindex', '1');
    controller.init();

    expect(controller.attributes).toEqual({ tabindex: '1' });
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('should keep the value after the removal it queued is delivered', () => {
    const el = createHost();
    const controller = createTabindexController(el, jest.fn());

    el.setAttribute('tabindex', '0');
    MockMutationObserver.latest.emit('tabindex');
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ tabindex: '0' });
  });

  it('should leave a negative tabindex on the host', () => {
    const el = createHost({ tabindex: '-1' });

    const controller = createTabindexController(el, jest.fn());

    expect(controller.attributes).toEqual({});
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('should leave a negative tabindex written after load on the host', () => {
    const el = createHost({ tabindex: '0' });
    const controller = createTabindexController(el, jest.fn());

    el.setAttribute('tabindex', '-1');
    MockMutationObserver.latest.emit('tabindex');

    expect(controller.attributes).toEqual({});
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('should see a negative tabindex removed from the host', () => {
    const el = createHost({ tabindex: '-1' });
    const onChange = jest.fn();
    const controller = createTabindexController(el, onChange);

    el.removeAttribute('tabindex');
    MockMutationObserver.latest.emit('tabindex');

    expect(controller.attributes['tabindex']).toBeNull();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should leave tabindex on the host when there is no native element', () => {
    const el = createHost({ tabindex: '0' });

    const controller = createTabindexController(el, jest.fn(), () => false);

    expect(controller.attributes).toEqual({});
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('should put tabindex back on the host on refresh once there is no native element', () => {
    const el = createHost({ tabindex: '0' });
    let hasNativeElement = true;
    const controller = createTabindexController(el, jest.fn(), () => hasNativeElement);

    hasNativeElement = false;
    controller.refresh();

    expect(controller.attributes).toEqual({});
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex off the host on refresh once there is a native element', () => {
    const el = createHost({ tabindex: '0' });
    let hasNativeElement = false;
    const controller = createTabindexController(el, jest.fn(), () => hasNativeElement);

    hasNativeElement = true;
    controller.refresh();
    MockMutationObserver.latest.flush();

    expect(controller.attributes).toEqual({ tabindex: '0' });
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('should see tabindex removed from the host after refresh put it back', () => {
    const el = createHost({ tabindex: '0' });
    let hasNativeElement = true;
    const controller = createTabindexController(el, jest.fn(), () => hasNativeElement);

    hasNativeElement = false;
    controller.refresh();
    controller.destroy();
    el.removeAttribute('tabindex');
    controller.init();

    // A null clears it from the native element if the host becomes clickable again.
    expect(controller.attributes['tabindex']).toBeNull();
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('should keep a tabindex written in the same tick as a refresh that moves it off the host', () => {
    const el = createHost({ tabindex: '0' });
    let hasNativeElement = false;
    const controller = createTabindexController(el, jest.fn(), () => hasNativeElement);

    el.setAttribute('tabindex', '5');
    hasNativeElement = true;
    controller.refresh();

    expect(controller.attributes).toEqual({ tabindex: '5' });
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('should keep a tabindex written in the same tick as a refresh that puts it back on the host', () => {
    const el = createHost({ tabindex: '0' });
    let hasNativeElement = true;
    const controller = createTabindexController(el, jest.fn(), () => hasNativeElement);

    el.setAttribute('tabindex', '2');
    hasNativeElement = false;
    controller.refresh();

    expect(controller.attributes).toEqual({});
    expect(el.getAttribute('tabindex')).toBe('2');

    hasNativeElement = true;
    controller.refresh();

    expect(controller.attributes).toEqual({ tabindex: '2' });
  });

  it('should keep a tabindex written while detached when a refresh moves it off the host', () => {
    const el = createHost({ tabindex: '0' });
    let hasNativeElement = false;
    const controller = createTabindexController(el, jest.fn(), () => hasNativeElement);

    controller.destroy();
    el.setAttribute('tabindex', '3');
    hasNativeElement = true;
    controller.refresh();
    controller.init();

    expect(controller.attributes).toEqual({ tabindex: '3' });
    expect(el.hasAttribute('tabindex')).toBe(false);
  });
});
