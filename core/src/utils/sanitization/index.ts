/**
 * Does a simple sanitization of all elements
 * in an untrusted string
 */

export const sanitizeDOMString = (untrustedString: string | undefined): string | undefined => {

  const div = document.createElement('div');
  document.body.appendChild(div);

  try {
    if (typeof untrustedString !== 'string') { return untrustedString; }

    const blockedTags = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed'];
    const range = document.createRange();

    /**
     * Older version of Chrome require that we
     * explicitly create and select a context node
     */
    range.selectNode(div);

    const documentFragment = range.createContextualFragment(untrustedString);

    /**
     * Remove any elements
     * that are blocked
     */

    /* tslint:disable-next-line */
    for (let i = 0; i < blockedTags.length; i++) {
      const getElementsToRemove = documentFragment.querySelectorAll(blockedTags[i]);
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
        for (let childIndex = element.children.length - 1; childIndex >= 0; childIndex--) {
          sanitizeElement(element.children[childIndex]);
        }
      }
    }

    /**
     * Go through remaining
     * elements and remove
     * non-allowed attribs
     */

    // IE does not support .children on document fragments, only .childNodes
    /* tslint:disable-next-line */
    const documentFragmentChildren = (documentFragment.children != null) ? documentFragment.children : documentFragment.childNodes;
    for (const childEl of (documentFragmentChildren as any)) {
      sanitizeElement(childEl);
    }

    // Remove context node from DOM
    document.body.removeChild(div);

    // Append document fragment to div
    div.appendChild(documentFragment);

    return div.innerHTML;

  } catch (err) {
    console.error(err);

    // Remove context node from DOM
    document.body.removeChild(div);

    return '';
  }
};

/**
 * Clean up current element based on allowed attributes
 * and then recursively dig down into any child elements to
 * clean those up as well
 */
const sanitizeElement = (element: any) => {
  // IE uses childNodes, so ignore nodes that are not elements
  if (element.nodeType && element.nodeType !== 1) { return; }

  const allowedAttributes = ['class', 'id', 'href', 'src'];

  for (let i = element.attributes.length - 1; i >= 0; i--) {
    const attribute = element.attributes[i];
    const attributeName = attribute.name;

    // remove non-allowed attribs
    if (!allowedAttributes.includes(attributeName.toLowerCase())) {
      element.removeAttribute(attributeName);
      continue;
    }

    // clean up any allowed attribs
    // that attempt to do any JS funny-business
    const attributeValue = attribute.value;

    /* tslint:disable-next-line */
    if (attributeValue != null && attributeValue.toLowerCase().includes('javascript:')) {
      element.removeAttribute(attributeName);
    }
  }

  /**
   * Sanitize any nested children
   */
  for (let i = element.children.length - 1; i >= 0; i--) {
    sanitizeElement(element.children[i]);
  }
};
