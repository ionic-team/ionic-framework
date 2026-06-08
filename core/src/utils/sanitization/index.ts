import { printIonError } from '@utils/logging';

/**
 * Sanitize an untrusted HTML string.
 *
 * Parses the string into a detached DOM, removes blocked tags, strips
 * attributes outside the `allowedAttributes` list (refer `sanitizeElement`),
 * and scrubs script-scheme URLs. Returns the sanitized HTML string.
 *
 * Use this when you have an HTML string from an unknown source and need to
 * render it via `innerHTML`. Use `sanitizeDOMTree` instead when you already
 * have a DOM tree and want to sanitize it in place without a string round
 * trip; both apply the same attribute policy.
 *
 * @param untrustedString - The HTML string to sanitize. Pass an
 * `IonicSafeString` to bypass sanitization, or `undefined` to short-circuit.
 * @returns The sanitized HTML string, or `undefined` if the input was
 * `undefined`. Returns `''` if sanitization fails or the input contains
 * an inline `onload=` handler.
 */
export const sanitizeDOMString = (untrustedString: IonicSafeString | string | undefined): string | undefined => {
  try {
    if (untrustedString instanceof IonicSafeString) {
      return untrustedString.value;
    }
    if (!isSanitizerEnabled() || typeof untrustedString !== 'string' || untrustedString === '') {
      return untrustedString;
    }

    /**
     * onload is fired when appending to a document
     * fragment in Chrome. If a string
     * contains onload then we should not
     * attempt to add this to the fragment.
     */
    if (untrustedString.includes('onload=')) {
      return '';
    }

    /**
     * Create a document fragment
     * separate from the main DOM,
     * create a div to do our work in
     */
    const documentFragment = document.createDocumentFragment();
    const workingDiv = document.createElement('div');
    documentFragment.appendChild(workingDiv);
    workingDiv.innerHTML = untrustedString;

    /**
     * Remove any elements
     * that are blocked
     */
    blockedTags.forEach((blockedTag) => {
      const getElementsToRemove = documentFragment.querySelectorAll(blockedTag);
      for (let elementIndex = getElementsToRemove.length - 1; elementIndex >= 0; elementIndex--) {
        const element = getElementsToRemove[elementIndex];
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        } else {
          documentFragment.removeChild(element);
        }

        /**
         * We still need to sanitize
         * the children of this element
         * as they are left behind
         */
        const childElements = getElementChildren(element);

        /* eslint-disable-next-line */
        for (let childIndex = 0; childIndex < childElements.length; childIndex++) {
          sanitizeElement(childElements[childIndex]);
        }
      }
    });

    /**
     * Go through remaining elements and remove
     * non-allowed attribs
     */

    // IE does not support .children on document fragments, only .childNodes
    const dfChildren = getElementChildren(documentFragment);

    /* eslint-disable-next-line */
    for (let childIndex = 0; childIndex < dfChildren.length; childIndex++) {
      sanitizeElement(dfChildren[childIndex]);
    }

    // Append document fragment to div
    const fragmentDiv = document.createElement('div');
    fragmentDiv.appendChild(documentFragment);

    // First child is always the div we did our work in
    const getInnerDiv = fragmentDiv.querySelector('div');
    return getInnerDiv !== null ? getInnerDiv.innerHTML : fragmentDiv.innerHTML;
  } catch (err) {
    printIonError('sanitizeDOMString', err);

    return '';
  }
};

/**
 * Sanitize an entire trusted DOM tree in place.
 *
 * Removes blocked tags (`script`, `iframe`, etc.) from the subtree and
 * then sanitizes attributes on every remaining element using the same
 * allowlist policy as `sanitizeDOMString` (refer `sanitizeElement`).
 * Component presentational attributes (`size`, `color`, `shape`, inline
 * SVG, `aria-*`, `data-*`) are preserved; `style`, event handlers (`on*`),
 * form/navigation-hijack attributes, script-scheme URLs, and non-image
 * `data:` URLs are stripped.
 *
 * Use this when you have a DOM tree the developer controls (e.g.
 * cloned slot content from a component) and you need to render it
 * elsewhere safely.
 *
 * @param root - The root element whose subtree will be sanitized in
 * place. No-op when the sanitizer is disabled via `Ionic.config`.
 */
export const sanitizeDOMTree = (root: HTMLElement) => {
  if (!isSanitizerEnabled()) {
    return;
  }

  blockedTags.forEach((tag) => {
    const matches = root.querySelectorAll(tag);
    for (let i = matches.length - 1; i >= 0; i--) {
      matches[i].remove();
    }
  });

  sanitizeElement(root);
};

/**
 * Clean up current element based on allowed attributes
 * and then recursively dig down into any child elements to
 * clean those up as well
 */
// TODO(FW-2832): type (using Element triggers other type errors as well)
const sanitizeElement = (element: any) => {
  // IE uses childNodes, so ignore nodes that are not elements
  if (element.nodeType && element.nodeType !== 1) {
    return;
  }

  /**
   * If attributes is not a NamedNodeMap
   * then we should remove the element entirely.
   * This helps avoid DOM Clobbering attacks where
   * attributes is overridden.
   */
  if (typeof NamedNodeMap !== 'undefined' && !(element.attributes instanceof NamedNodeMap)) {
    element.remove();
    return;
  }

  /**
   * Always strip `style` (CSS injection, `background:url()` beaconing, UI
   * spoofing). It is never on the allowlist, but it is removed explicitly
   * here because some engines (e.g. jsdom) don't enumerate the CSSOM-backed
   * `style` attribute in `element.attributes`, which would let the loop
   * below skip over it.
   */
  element.removeAttribute('style');

  for (let i = element.attributes.length - 1; i >= 0; i--) {
    const attribute = element.attributes.item(i);
    const attributeName = attribute.name;
    const lowerName = attributeName.toLowerCase();

    /**
     * Remove any attribute that is not on the allowlist. This drops event
     * handlers (`on*`), `style`, the form/navigation-hijack attributes
     * (`formaction`, `action`, `target`), namespaced attributes like
     * `xlink:href`, and anything else not explicitly known to be safe.
     */
    if (!isAttributeAllowed(lowerName)) {
      element.removeAttribute(attributeName);
      continue;
    }

    // clean up any allowed attribs
    // that attempt to do any JS funny-business
    const attributeValue = attribute.value;
    if (attributeValue == null) {
      continue;
    }

    /**
     * Scrub dangerous schemes from the value. The value is normalized first
     * (whitespace and ASCII control characters removed) so entity-obfuscated
     * payloads such as `java&#9;script:`, which the parser decodes to
     * `java\tscript:`, are still caught. Normalizing the value also covers
     * namespaced attributes, where the previous `element[attributeName]`
     * property reflection returned `undefined` and let them slip through.
     */
    const normalizedValue = attributeValue.replace(controlCharactersAndWhitespace, '').toLowerCase();

    // Script schemes are never allowed, on any attribute.
    if (normalizedValue.includes('javascript:') || normalizedValue.includes('vbscript:')) {
      element.removeAttribute(attributeName);
      continue;
    }

    /**
     * For URL-bearing attributes, allow `data:` URIs only for raster
     * images. Document-bearing types (`text/html`, `image/svg+xml`,
     * `application/*`, etc.) can carry markup or script when navigated to
     * or rendered, so they are stripped, while safe image types are kept so
     * inline images keep working.
     */
    if (
      urlAttributes.includes(lowerName) &&
      normalizedValue.startsWith('data:') &&
      !safeDataImageUri.test(normalizedValue)
    ) {
      element.removeAttribute(attributeName);
    }
  }

  /**
   * Sanitize any nested children
   */
  const childElements = getElementChildren(element);

  /* eslint-disable-next-line */
  for (let i = 0; i < childElements.length; i++) {
    sanitizeElement(childElements[i]);
  }
};

/**
 * IE doesn't always support .children
 * so we revert to .childNodes instead
 */
// TODO(FW-2832): type
const getElementChildren = (el: any) => {
  return el.children != null ? el.children : el.childNodes;
};

const isSanitizerEnabled = (): boolean => {
  const win = window as any;
  const config = win?.Ionic?.config;
  if (config) {
    if (config.get) {
      return config.get('sanitizerEnabled', true);
    } else {
      return config.sanitizerEnabled === true || config.sanitizerEnabled === undefined;
    }
  }
  return true;
};

/**
 * Mirror known custom-element DOM properties onto attributes so they
 * survive `cloneNode`. Call this on a DOM subtree before cloning it for
 * rendering elsewhere (e.g. cloning slotted option content into an
 * overlay).
 *
 * Only sets the attribute when the property holds a non-empty string
 * and the attribute isn't already present, so existing attributes
 * take precedence.
 *
 * @param root - The root element whose subtree (and itself) will be
 * inspected.
 */
export const reflectPropertiesToAttributes = (root: Element): void => {
  const candidates: Element[] = [];
  if (root.tagName in elementPropsToReflect) {
    candidates.push(root);
  }
  for (const tagName of Object.keys(elementPropsToReflect)) {
    candidates.push(...Array.from(root.querySelectorAll(tagName.toLowerCase())));
  }

  for (const el of candidates) {
    if (!(el.tagName in elementPropsToReflect)) {
      continue;
    }
    const props = elementPropsToReflect[el.tagName];
    for (const prop of props) {
      const value = (el as unknown as Record<string, unknown>)[prop];
      if (typeof value === 'string' && value.length > 0 && !el.hasAttribute(prop)) {
        el.setAttribute(prop, value);
      }
    }
  }
};

/**
 * Attribute names that are always safe to keep. Covers global HTML
 * attributes, the Ionic component presentational props that cloned rich
 * content (e.g. `ion-select-option` markup) relies on, and the inert SVG
 * presentation attributes used by inline icons.
 *
 * `aria-*` and `data-*` are allowed separately by prefix (refer
 * `allowedAttributePrefixes`) since they are inert and not worth
 * enumerating. URL-bearing names (`href`, `src`) are allowed here, but
 * their values are still scrubbed for script schemes in `sanitizeElement`.
 *
 * Notably absent: `style`, event handlers (`on*`), and the
 * form/navigation-hijack attributes (`formaction`, `action`, `target`),
 * which are therefore stripped.
 */
const allowedAttributes = [
  // Global / structural
  'class',
  'id',
  'slot',
  'name',
  'title',
  'alt',
  'lang',
  'dir',
  'role',
  'type',
  'value',
  'disabled',
  'width',
  'height',
  'href',
  'src',
  // Ionic component presentational props
  'color',
  'size',
  'shape',
  'fill',
  'expand',
  'mode',
  'theme',
  'icon',
  'label',
  'label-placement',
  'justify',
  'inset',
  'lines',
  'ios',
  'md',
  // SVG presentation attributes (compared lowercased, e.g. `viewBox`)
  'xmlns',
  'viewbox',
  'preserveaspectratio',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-opacity',
  'stroke-dasharray',
  'fill-rule',
  'fill-opacity',
  'clip-rule',
  'd',
  'points',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'x',
  'y',
  'x1',
  'y1',
  'x2',
  'y2',
  'transform',
  'opacity',
];

/**
 * Attribute-name prefixes that are always safe to keep. `aria-*` and
 * `data-*` attributes cannot execute script or load resources, so they are
 * allowed wholesale rather than enumerated by name.
 */
const allowedAttributePrefixes = ['aria-', 'data-'];

/**
 * Whether an attribute name (already lowercased) is safe to keep, by exact
 * match or by an allowed prefix.
 */
const isAttributeAllowed = (lowerName: string): boolean => {
  if (allowedAttributes.includes(lowerName)) {
    return true;
  }
  return allowedAttributePrefixes.some((prefix) => lowerName.startsWith(prefix));
};

/**
 * Matches ASCII control characters and whitespace (including the
 * non-breaking space). Used to normalize attribute values before matching
 * a URL scheme so entity-obfuscated payloads such as `java&#9;script:`
 * (decoded by the parser to `java\tscript:`) can't smuggle a scheme past
 * the check.
 */
// eslint-disable-next-line no-control-regex -- matching control characters is the point
const controlCharactersAndWhitespace = /[\u0000-\u0020\u007f-\u00a0]/g;

/**
 * Attributes whose values are URLs. Their values are scheme-checked in
 * `sanitizeElement` (e.g. `data:` filtering) beyond the script-scheme scrub
 * applied to every attribute.
 */
const urlAttributes = ['href', 'src'];

/**
 * Matches a `data:` URI for a raster image type that cannot carry script.
 * `image/svg+xml` is deliberately excluded (SVG can execute script), as are
 * document types like `text/html` and `application/*`. The value is already
 * lowercased and whitespace-stripped before this is tested.
 */
const safeDataImageUri = /^data:image\/(?:png|jpe?g|gif|webp|bmp|avif|x-icon|vnd\.microsoft\.icon)[;,]/;

/**
 * Tags removed entirely (with their subtree) before attribute sanitization.
 * Exported so tests can assert the set without hardcoding it.
 */
export const blockedTags = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed', 'base'];

/**
 * Properties on custom elements that frameworks (Vue, Angular) often
 * set as DOM properties rather than attributes. `cloneNode` only copies
 * attributes, so these values are lost when slotted content is cloned
 * into an overlay. For each known custom element, we mirror the listed
 * properties onto attributes so the cloned copy still has the data it
 * needs to render.
 *
 * Keyed by uppercased tagName so the lookup matches `Element.tagName`.
 */
const elementPropsToReflect: Record<string, string[]> = {
  'ION-ICON': ['icon', 'name', 'src', 'ios', 'md'],
};

export class IonicSafeString {
  constructor(public value: string) {}
}
