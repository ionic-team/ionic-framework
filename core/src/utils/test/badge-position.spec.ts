import { createBadgeManager, createBadgeObserver } from '../badge-position';

describe('createBadgeObserver', () => {
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;
  let resizeCallback: ResizeObserverCallback;

  beforeEach(() => {
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
      resizeCallback = cb;
      return { observe: mockObserve, disconnect: mockDisconnect };
    }) as unknown as typeof ResizeObserver;
  });

  const makeEl = () => document.createElement('div');

  it('observes the target', () => {
    const target = makeEl();
    const badge = makeEl();
    createBadgeObserver({ badge, target });
    expect(mockObserve).toHaveBeenCalledWith(target);
  });

  it('observes relativeTo when it differs from target', () => {
    const target = makeEl();
    const relativeTo = makeEl();
    const badge = makeEl();
    createBadgeObserver({ badge, target, relativeTo });
    expect(mockObserve).toHaveBeenCalledWith(relativeTo);
  });

  it('does not observe target twice when relativeTo is omitted', () => {
    const target = makeEl();
    const badge = makeEl();
    createBadgeObserver({ badge, target });
    const calls = mockObserve.mock.calls.map(([el]: [Element]) => el);
    expect(calls.filter((el) => el === target)).toHaveLength(1);
  });

  it('observes the badge so arc-based position recomputes on badge resize', () => {
    const target = makeEl();
    const badge = makeEl();
    createBadgeObserver({ badge, target });
    expect(mockObserve).toHaveBeenCalledWith(badge);
  });

  it('repositions the badge when it resizes', () => {
    const target = makeEl();
    const badge = makeEl();
    badge.setAttribute('vertical', 'top');
    createBadgeObserver({ badge, target });

    resizeCallback([], {} as ResizeObserver);

    expect(badge.style.insetInlineStart).not.toBe('');
  });

  it('disconnects the observer', () => {
    const obs = createBadgeObserver({ badge: makeEl(), target: makeEl() });
    obs.disconnect();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

describe('createBadgeManager', () => {
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    global.ResizeObserver = jest.fn(() => {
      return { observe: mockObserve, disconnect: mockDisconnect };
    }) as unknown as typeof ResizeObserver;
  });

  const makeHost = () => document.createElement('div');

  const addBadge = (host: HTMLElement) => {
    const badge = document.createElement('ion-badge');
    badge.setAttribute('vertical', 'top');
    host.appendChild(badge);
    return badge;
  };

  it('does not create an observer when no badge is present on init', () => {
    const host = makeHost();
    const manager = createBadgeManager(host, () => ({ target: host }));
    manager.init();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('does not create an observer when getConfig returns undefined', () => {
    const host = makeHost();
    addBadge(host);
    const manager = createBadgeManager(host, () => undefined);
    manager.init();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('onSlotChanged does not recreate the observer when badge and observer already exist', () => {
    const host = makeHost();
    addBadge(host);
    const manager = createBadgeManager(host, () => ({ target: host }));
    manager.init();

    const callCountAfterInit = mockObserve.mock.calls.length;
    manager.onSlotChanged();

    expect(mockObserve.mock.calls.length).toBe(callCountAfterInit);
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it('onSlotChanged sets up observer when badge is added after init', () => {
    const host = makeHost();
    const manager = createBadgeManager(host, () => ({ target: host }));
    manager.init();

    expect(mockObserve).not.toHaveBeenCalled();

    addBadge(host);
    manager.onSlotChanged();

    expect(mockObserve).toHaveBeenCalled();
  });

  it('onSlotChanged disconnects the observer when badge is removed', () => {
    const host = makeHost();
    const badge = addBadge(host);
    const manager = createBadgeManager(host, () => ({ target: host }));
    manager.init();

    badge.remove();
    manager.onSlotChanged();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('destroy disconnects the observer when called directly', () => {
    const host = makeHost();
    addBadge(host);
    const manager = createBadgeManager(host, () => ({ target: host }));
    manager.init();

    manager.destroy();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
