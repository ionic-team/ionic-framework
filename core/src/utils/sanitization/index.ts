/**
 * Does a simple sanitization of all elements
 * in an untrusted string
 */

export const sanitizeDOMString = (untrustedString: string | undefined): string | undefined => {

  const div = document.createElement('div');
  document.body.appendChild(div);

  try {
    if (typeof untrustedString !== 'string') { return untrustedString; }

    const whitelistedAttributes = ['class', 'id', 'href', 'src'];
    const blacklistedTags = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed'];
    const range = document.createRange();

    /**
     * Older version of Chrome require that we
     * explicitly create and select a context node
     */
    range.selectNode(div);

    const documentFragment = range.createContextualFragment(untrustedString);

    /**
     * Remove any elements
     * that are blacklisted
     */
    for (const blacklistedTag of blacklistedTags) {
      const getElementsToRemove = documentFragment.querySelectorAll(blacklistedTag);
      getElementsToRemove.forEach(element => {
        documentFragment.removeChild(element);
      });
    }

    for (const childEl of (documentFragment.children as any)) {

      /**
       * Since childEl.attributes is a live object
       * we need to process all attributes before
       * we can remove any of them
       */
      const attributesToRemove = [];
      for (const attribute of childEl.attributes) {
        const attributeName = attribute.name;

        // remove non-whitelisted attribs
        if (!whitelistedAttributes.includes(attributeName.toLowerCase())) {
          attributesToRemove.push(attributeName);
          continue;
        }

        // clean up any whitelisted attribs
        // that attempt to do any JS funny-business
        const attributeValue = attribute.value;

        /* tslint:disable-next-line */
        if (attributeValue != null && attributeValue.toLowerCase().includes('javascript:')) {
          attributesToRemove.push(attributeName);
        }
      }

      /**
       * Finally, remove all marked attributes from element
       */
      for (const attributeName of attributesToRemove) {
        childEl.removeAttribute(attributeName);
      }
    }

    // Remove context node from DOM
    document.body.removeChild(div);

    return new XMLSerializer().serializeToString(documentFragment);

  } catch (err) {
    console.error(err);

    // Remove context node from DOM
    document.body.removeChild(div);

    return '';
  }
};
