import { win } from '@utils/browser';
import type { Attributes } from '@utils/helpers';
import { ariaAttributes, inheritAttributes } from '@utils/helpers';

const hostNamingAttributes = ['aria-label', 'aria-description', 'role'];

/**
 * Copies a set of attributes off the host element so they can be applied to an element
 * inside the shadow root, then keeps that copy in sync as the host attributes change.
 * Using `inheritAttributes` alone copies once at load, so anything written to the host
 * afterwards never reaches the element the assistive technology reads.
 *
 * Create the controller in `componentWillLoad`. It takes the initial copy and starts
 * watching right away, so `init()` is only needed to resume after a move.
 *
 * An `aria-label`, `aria-description` or `role` written after load is copied and then
 * replaced on the host with an empty string, so the host isn't a second node in the
 * accessibility tree and a later `removeAttribute` still fires a mutation. Anything else
 * stays on the host, since it leaves the host unnamed or, like `aria-labelledby`, only
 * resolves from there. The initial copy removes the attributes outright, so a value from
 * the initial markup can only be overwritten. An empty string works for `aria-label` and
 * friends, but a token-valued attribute has to be set to its default instead, so
 * `aria-pressed="false"` rather than empty.
 *
 * @internal
 * @param el The host element to copy from and watch.
 * @param attributes The attributes to copy and watch.
 * @param onChange Called after `attributes` changes, so the component can re-render.
 * @param hostOwnedAttributes Attributes copied at load but not watched. Use it for
 * attributes the component renders on its own `<Host>`, since a later change to one of
 * those is the component's own write.
 * @param keepOnHost While this returns `true`, a value written after load stays on the
 * host. It's checked on every write and on `updateHost()`. Use it when the component
 * sometimes renders nothing that can carry the copy.
 */
export const createAttributeController = (
  el: HTMLElement,
  attributes: string[],
  onChange: () => void,
  hostOwnedAttributes: string[] = [],
  keepOnHost: () => boolean = () => false
): AttributeController => {
  let inherited: Attributes = inheritAttributes(el, attributes);
  let observer: MutationObserver | undefined;

  const watchedAttributes = attributes.filter((attr) => !hostOwnedAttributes.includes(attr));

  /**
   * The names written to the host after load, including the empty strings we leave in
   * place of a copy. The initial copy removes what it captures, so a missing attribute
   * only counts as a removal when its name is in here.
   */
  const hostWritten = new Set<string>();

  /**
   * The names whose host value is our empty string, not one the developer wrote.
   */
  const replaced = new Set<string>();

  const setPresence = (name: string, value: string | null) => {
    if (value === null) {
      hostWritten.delete(name);
    } else {
      hostWritten.add(name);
    }
  };

  const replaceOnHost = (written: Attributes) => {
    const keep = keepOnHost();

    for (const [name, value] of Object.entries(written)) {
      // An empty value already gives the host no name, so it can stay as written.
      if (keep || value === null || value === '' || !hostNamingAttributes.includes(name)) {
        replaced.delete(name);
        continue;
      }

      el.setAttribute(name, '');
      replaced.add(name);
    }

    // Drain our own writes so the observer doesn't read them as the developer's.
    observer?.takeRecords();
  };

  const restoreOnHost = () => {
    for (const name of replaced) {
      el.setAttribute(name, inherited[name]!);
    }

    replaced.clear();
    observer?.takeRecords();
  };

  const applyMutations = (mutations: MutationRecord[]) => {
    const changed: Attributes = {};

    for (const mutation of mutations) {
      const name = mutation.attributeName!;
      // A removed attribute reads back as null, which clears it from the element the
      // values are spread onto.
      const value = el.getAttribute(name);

      setPresence(name, value);
      changed[name] = value;
    }

    inherited = { ...inherited, ...changed };
    replaceOnHost(changed);
    onChange();
  };

  /**
   * Nothing is watching while the host is out of the tree, since `disconnectedCallback`
   * calls `destroy()`, and `forceUpdate` is a no-op on a disconnected host anyway. So
   * the host has to be re-read on the way back in.
   */
  const readMissedChanges = () => {
    const written: Attributes = {};
    const changed: Attributes = {};

    for (const name of watchedAttributes) {
      const value = el.getAttribute(name);
      const wasOnHost = hostWritten.has(name);

      setPresence(name, value);

      /**
       * An attribute that was never written to the host is missing because the initial
       * copy took it, not because the developer cleared it.
       */
      if (value === null && !wasOnHost) {
        continue;
      }

      // Even a rewrite of the same value has to be replaced on the host.
      written[name] = value;

      if (value !== inherited[name]) {
        changed[name] = value;
      }
    }

    replaceOnHost(written);

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

    observer = new MutationObserver(applyMutations);
    observer.observe(el, { attributeFilter: watchedAttributes });
  };

  const destroy = () => {
    if (observer === undefined) {
      return;
    }

    // Apply a write made just before the move, since it hasn't been delivered yet.
    const pending = observer.takeRecords();

    if (pending.length > 0) {
      applyMutations(pending);
    }

    observer.disconnect();
    observer = undefined;

    // Put the copied values back while detached, or `init()` would read our empty strings
    // as the developer clearing them.
    restoreOnHost();
  };

  const updateHost = () => {
    // A detached host already has its values back, and `init()` checks again on reattach.
    if (observer === undefined) {
      return;
    }

    // Our writes below drain the queue, so apply a write made in the same task first.
    const pending = observer.takeRecords();

    if (pending.length > 0) {
      applyMutations(pending);
    }

    if (keepOnHost()) {
      restoreOnHost();
      return;
    }

    const written: Attributes = {};

    for (const name of hostWritten) {
      if (!replaced.has(name)) {
        written[name] = el.getAttribute(name);
      }
    }

    replaceOnHost(written);
  };

  /**
   * Has to run after the initial copy, because that copy removes the attributes from the
   * host and an observer armed any earlier would read the removal as a developer clearing
   * them.
   */
  init();

  return {
    get attributes() {
      return inherited;
    },
    init,
    destroy,
    updateHost,
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
   * Stops watching the host element and puts back the values it replaced, so a move keeps
   * them. Call this from `disconnectedCallback`.
   */
  destroy: () => void;
  /**
   * Checks `keepOnHost` again and moves the values written after load onto or off the
   * host to match. Call it when something `keepOnHost` reads changes.
   */
  updateHost: () => void;
};
