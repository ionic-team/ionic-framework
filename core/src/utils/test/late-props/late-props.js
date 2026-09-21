/**
 * Test helpers for the custom elements build, where `connectedCallback` runs
 * synchronously as the element is inserted. Frameworks that assign element props after
 * inserting the element leave a window where a component can't read its own props or
 * its children's, and it still has to work.
 */

import { initialize } from '/components/index.js';

/**
 * Initializes Ionic in the mode the test asked for.
 */
export const initializeIonic = () => {
  initialize({ mode: new URLSearchParams(location.search).get('ionic:mode') ?? 'ios' });
};

/**
 * Defines the given tags. Safe to call again for tags that are already defined, so each
 * test can ask for whatever it needs.
 */
export const defineTags = async (tags) => {
  await Promise.all(
    tags.map(async (tag) => {
      const mod = await import(`/components/${tag}.js`);
      mod.defineCustomElement();
    })
  );
};

/**
 * Builds the tree described by `spec` and appends it to `root`. A spec node is
 * `{ tag, props, attrs, children }`, where `children` holds specs or strings. The
 * `attrs` are always set before the element connects, and the `props` are set before
 * connecting when `lateProps` is false, or after the whole tree connects when it is true.
 */
export const mount = (root, spec, lateProps) => {
  const pending = [];

  const build = (node) => {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

    const el = document.createElement(node.tag);

    if (node.attrs) {
      Object.entries(node.attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
    }

    if (node.props) {
      if (lateProps) {
        pending.push([el, node.props]);
      } else {
        Object.assign(el, node.props);
      }
    }

    (node.children || []).forEach((child) => el.appendChild(build(child)));

    return el;
  };

  const tree = build(spec);

  root.appendChild(tree);

  // Descendants before ancestors, matching the order framework effects run in.
  pending.reverse().forEach(([el, props]) => Object.assign(el, props));
};
