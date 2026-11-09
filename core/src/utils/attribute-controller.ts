import { win } from '@utils/browser';
import type { Attributes } from '@utils/helpers';
import { ariaAttributes, inheritAttributes } from '@utils/helpers';

/**
 * Copies a set of attributes off the host element so they can be applied to an element
 * inside the shadow root, then keeps that copy in sync as the host attributes change.
 * Using `inheritAttributes` alone copies once at load, so anything written to the host
 * afterwards never reaches the element the assistive technology reads.
 *
 * Create the controller in `componentWillLoad`. It takes the initial copy and starts
 * watching right away, so `init()` is only needed to resume after a move.
 *
 * Two things to know before adopting it. Unless `moveFromHost` says otherwise, only the
 * initial copy removes the attributes from the host, so a value written after load sits
 * on the host as well as on the element it is applied to, which matters if the host has
 * a role of its own. And an attribute moved off the host can never be removed, only
 * overwritten, since removing it from the host doesn't fire a mutation.
 * An empty string works for `aria-label` and friends, but a token-valued attribute
 * has to be set to its default instead, so `aria-pressed="false"` rather than empty.
 *
 * @internal
 * @param el The host element to copy from and watch.
 * @param attributes The attributes to copy and watch.
 * @param onChange Called after `attributes` changes, so the component can re-render.
 * @param hostOwnedAttributes Attributes copied at load but not watched. Use it for
 * attributes the component renders on its own `<Host>`, since a later change to one of
 * those is the component's own write, and for attributes that would put a second node in
 * the accessibility tree if the host kept a copy alongside the one we apply.
 * @param moveFromHost Called on load and after every write to decide whether a value moves
 * off the host. A rejected value stays on the host and is left out of `attributes`.
 */
export const createAttributeController = (
  el: HTMLElement,
  attributes: string[],
  onChange: () => void,
  hostOwnedAttributes: string[] = [],
  moveFromHost?: (name: string, value: string) => boolean
): AttributeController => {
  let inherited: Attributes = inheritAttributes(el, attributes);
  let observer: MutationObserver | undefined;

  const staysOnHost = (name: string, value: string | null | undefined) =>
    moveFromHost !== undefined && value != null && !moveFromHost(name, value);

  const watchedAttributes = attributes.filter((attr) => !hostOwnedAttributes.includes(attr));

  /**
   * The names still on the host, which is everything written after load. The initial
   * copy removes what it captures, so a missing attribute only counts as a removal
   * when its name is in here.
   */
  const hostWritten = new Set<string>();

  const setPresence = (name: string, value: string | null) => {
    if (value === null) {
      hostWritten.delete(name);
    } else {
      hostWritten.add(name);
    }
  };

  const moveOffHost = (changed: Attributes) => {
    if (moveFromHost === undefined) {
      return;
    }

    for (const [name, value] of Object.entries(changed)) {
      if (value != null && !staysOnHost(name, value)) {
        el.removeAttribute(name);
        // Without this, the missing attribute would read as a developer removal later.
        hostWritten.delete(name);
      }
    }
  };

  // The initial copy took everything off the host, so put back what has to stay there.
  for (const [name, value] of Object.entries(inherited)) {
    if (staysOnHost(name, value)) {
      el.setAttribute(name, value!);
      hostWritten.add(name);
    }
  }

  /**
   * Nothing is watching while the host is out of the tree, since `disconnectedCallback`
   * calls `destroy()`, and `forceUpdate` is a no-op on a disconnected host anyway. So
   * the host has to be re-read on the way back in.
   */
  const readMissedChanges = () => {
    const changed: Attributes = {};

    for (const name of watchedAttributes) {
      const value = el.getAttribute(name);
      const wasOnHost = hostWritten.has(name);

      setPresence(name, value);

      /**
       * An attribute that was never written to the host is missing because the initial
       * copy took it, not because the developer cleared it.
       */
      if ((value === null && !wasOnHost) || value === inherited[name]) {
        continue;
      }

      changed[name] = value;
    }

    moveOffHost(changed);

    if (Object.keys(changed).length > 0) {
      inherited = { ...inherited, ...changed };
      onChange();
    }
  };

  const init = () => {
    // There is no MutationObserver in SSR or the hydrate build.
    if (observer !== undefined || watchedAttributes.length === 0 || win === undefined || !('MutationObserver' in win)) {
      return;
    }

    readMissedChanges();

    observer = new MutationObserver((mutations) => {
      const changed: Attributes = {};

      for (const mutation of mutations) {
        const name = mutation.attributeName!;
        // A removed attribute reads back as null, which clears it from the element the
        // values are spread onto.
        const value = el.getAttribute(name);

        setPresence(name, value);
        changed[name] = value;
      }

      moveOffHost(changed);
      // Drop the removals `moveOffHost` just queued, or they'd read back as the developer
      // clearing the attribute.
      observer?.takeRecords();

      inherited = { ...inherited, ...changed };
      onChange();
    });

    observer.observe(el, { attributeFilter: watchedAttributes });
  };

  const destroy = () => {
    observer?.disconnect();
    observer = undefined;
  };

  /**
   * Has to run after the initial copy, because that copy removes the attributes from the
   * host and an observer armed any earlier would read the removal as a developer clearing
   * them.
   */
  init();

  return {
    get attributes() {
      if (moveFromHost === undefined) {
        return inherited;
      }

      const moved: Attributes = {};
      for (const [name, value] of Object.entries(inherited)) {
        if (!staysOnHost(name, value)) {
          moved[name] = value;
        }
      }
      return moved;
    },
    init,
    destroy,
  };
};

/**
 * The `createAttributeController` equivalent of `inheritAriaAttributes`, which copies and
 * watches every ARIA attribute plus `role`.
 *
 * @internal
 * @param el The host element to copy from and watch.
 * @param onChange Called after the attributes change, so the component can re-render.
 * @param hostOwnedAttributes Attributes copied at load but not watched. See
 * `createAttributeController`.
 */
export const createAriaAttributeController = (
  el: HTMLElement,
  onChange: () => void,
  hostOwnedAttributes: string[] = []
): AttributeController => {
  return createAttributeController(el, ariaAttributes, onChange, hostOwnedAttributes);
};

/**
 * Moves `tabindex` from the host to the native element in the shadow root, including later
 * writes, since a host with a `tabindex` is an extra tab stop with no name. A negative
 * `tabindex` stays on the host, where it already skips the shadow root and the focus
 * utilities expect to find it.
 *
 * @internal
 * @param el The host element to copy from and watch.
 * @param onChange Called after `tabindex` changes, so the component can re-render.
 */
export const createTabindexController = (el: HTMLElement, onChange: () => void): AttributeController => {
  return createAttributeController(el, ['tabindex'], onChange, [], (_, value) => parseInt(value, 10) >= 0);
};

export type AttributeController = {
  /**
   * The attributes copied off the host element. Spread these onto the native element
   * in `render()`.
   */
  readonly attributes: Attributes;
  /**
   * Resumes watching the host element. Only needed from `connectedCallback`, because the
   * controller can't just be recreated in `componentWillLoad` after a move once the
   * initial copy has taken the attributes off the host.
   */
  init: () => void;
  /**
   * Stops watching the host element. Call this from `disconnectedCallback`.
   */
  destroy: () => void;
};
