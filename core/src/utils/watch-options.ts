export const watchForOptions = <T extends HTMLElement>(
  containerEl: HTMLElement,
  tagName: string,
  onChange: (el: T | undefined) => void
) => {
  if (typeof MutationObserver === 'undefined') {
    return;
  }

  const mutation = new MutationObserver((mutationList) => {
    onChange(getSelectedOption<T>(mutationList, tagName));
  });
  mutation.observe(containerEl, {
    childList: true,
    subtree: true,
  });
  return mutation;
};

const getSelectedOption = <T extends HTMLElement>(mutationList: MutationRecord[], tagName: string): T | undefined => {
  let newOption: T | undefined;
  mutationList.forEach((mut) => {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < mut.addedNodes.length; i++) {
      newOption = findCheckedOption<T>(mut.addedNodes[i], tagName) || newOption;
    }
  });
  return newOption;
};

/**
 * The "value" key is only set on some components such as ion-select-option.
 * As a result, we create a default union type of HTMLElement and the "value" key.
 * However, implementers are required to provide the appropriate component type
 * such as HTMLIonSelectOptionElement.
 */
export const findCheckedOption = <T extends HTMLElement & { value?: any | null }>(node: Node, tagName: string) => {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
   * The above check ensures "node" is an Element (nodeType 1).
   */
  if (node.nodeType !== 1) {
    return undefined;
  }

  // HTMLElement inherits from Element, so we cast "el" as T.
  const el = node as T;

  const options: T[] = el.tagName === tagName.toUpperCase() ? [el] : Array.from(el.querySelectorAll(tagName));

  return options.find((o: T) => o.value === el.value);
};
