/**
 * Does a simple sanitization of all elements
 * in an untrusted string
 */

export const sanitizeDOMString = (untrustedString: string | undefined): string | undefined => {
  try {
    if (typeof untrustedString !== 'string' || untrustedString === '') { return untrustedString; }

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
    blockedTags.forEach(blockedTag => {

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

        /* tslint:disable-next-line */
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
    const documentFragmentChildren = getElementChildren(documentFragment);

    /* tslint:disable-next-line */
    for (let childIndex = 0; childIndex < documentFragmentChildren.length; childIndex++) {
      sanitizeElement(documentFragmentChildren[childIndex]);
    }

    // Append document fragment to div
    const fragmentDiv = document.createElement('div');
    fragmentDiv.appendChild(documentFragment);

    // First child is always the div we did our work in
    const getInnerDiv = fragmentDiv.querySelector('div');
    return (getInnerDiv !== null) ? getInnerDiv.innerHTML : fragmentDiv.innerHTML;

  } catch (err) {
    console.error(err);

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
  const childElements = getElementChildren(element);

  /* tslint:disable-next-line */
  for (let i = 0; i < childElements.length; i++) {
    sanitizeElement(childElements[i]);
  }
};

/**
 * IE doesn't always support .children
 * so we revert to .childNodes instead
 */
const getElementChildren = (element: any) => {
  return (element.children != null) ? element.children : element.childNodes;
};

const allowedAttributes = ['class', 'id', 'href', 'src', 'name', 'slot'];
const blockedTags = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed'];
