/**
 * Does a simple sanitization of all elements
 * in an untrusted string
 */

export const sanitizeDOMString = (untrustedString: string | undefined): string | undefined => {
  try {
    if (typeof untrustedString !== 'string') { return untrustedString; }

    const whitelistedAttributes = ['class', 'id', 'href', 'src'];
    const range = document.createRange();
    const documentFragment = range.createContextualFragment(untrustedString);

    for (const childEl of (documentFragment.children as any)) {
      for (const attributeName of childEl.getAttributeNames()) {

        // remove non-whitelisted attribs
        if (!whitelistedAttributes.includes(attributeName.toLowerCase())) {
          childEl.removeAttribute(attributeName);
          continue;
        }

        // clean up any whitelisted attribs
        // that attempt to do any JS funny-business
        const attributeValue = childEl.getAttribute(attributeName);

        /* tslint:disable-next-line */
        if (attributeValue != null && attributeValue.toLowerCase().includes('javascript:')) {
          childEl.removeAttribute(attributeName);
        }
      }
    }

    return new XMLSerializer().serializeToString(documentFragment);
  } catch (err) {
    console.error(err);
    return '';
  }
};
