import { printIonError } from '@utils/logging';

/**
 * Sanitize an untrusted HTML string.
 *
 * Parses the string into a detached DOM, removes blocked tags, strips
 * attributes outside the strict `allowedAttributes` list, and scrubs
 * `javascript:` URLs. Returns the sanitized HTML string.
 *
 * Use this when you have an HTML string from an unknown source and need
 * to render it via `innerHTML`. Prefer `sanitizeDOMTree` when the source
 * is author-controlled DOM that must keep its component attributes
 * (`size`, `color`, `shape`, etc.).
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
 * Sanitize an entire author-controlled DOM tree in place.
 *
 * Removes blocked tags (`script`, `iframe`, etc.) from the subtree and
 * then sanitizes attributes on every remaining element. Author-written
 * attributes like `size`, `color`, and `shape` are preserved; event
 * handlers (`on*`) and `javascript:` URLs are stripped.
 *
 * Use this when you have a DOM tree that the developer authored (e.g.
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

  sanitizeElement(root, true);
};

/**
 * Clean up current element based on allowed attributes
 * and then recursively dig down into any child elements to
 * clean those up as well
 */
// TODO(FW-2832): type (using Element triggers other type errors as well)
const sanitizeElement = (element: any, allowSafeAuthorAttributes = false) => {
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

  for (let i = element.attributes.length - 1; i >= 0; i--) {
    const attribute = element.attributes.item(i);
    const attributeName = attribute.name;
    const lowerName = attributeName.toLowerCase();

    // remove non-allowed attribs
    if (!allowSafeAuthorAttributes && !allowedAttributes.includes(lowerName)) {
      element.removeAttribute(attributeName);
      continue;
    }

    // strip event-handler attributes (already removed by the allowlist
    // when !allowSafeAuthorAttributes; this guards the permissive path)
    if (lowerName.startsWith('on')) {
      element.removeAttribute(attributeName);
      continue;
    }

    // clean up any allowed attribs
    // that attempt to do any JS funny-business
    const attributeValue = attribute.value;

    /**
     * We also need to check the property value
     * as javascript: can allow special characters
     * such as &Tab; and still be valid (i.e. java&Tab;script)
     */
    const propertyValue = element[attributeName];

    // Only call .toLowerCase() when propertyValue is a string. Some DOM
    // properties (e.g. `disabled`) are booleans and would throw.
    /* eslint-disable */
    if (
      (attributeValue != null && attributeValue.toLowerCase().includes('javascript:')) ||
      (propertyValue != null &&
        typeof propertyValue === 'string' &&
        propertyValue.toLowerCase().includes('javascript:'))
    ) {
      element.removeAttribute(attributeName);
    }
    /* eslint-enable */
  }

  /**
   * Sanitize any nested children
   */
  const childElements = getElementChildren(element);

  /* eslint-disable-next-line */
  for (let i = 0; i < childElements.length; i++) {
    sanitizeElement(childElements[i], allowSafeAuthorAttributes);
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

const allowedAttributes = ['class', 'id', 'href', 'src', 'name', 'slot'];
const blockedTags = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed'];

export class IonicSafeString {
  constructor(public value: string) {}
}
