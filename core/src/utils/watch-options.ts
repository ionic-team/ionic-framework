export const watchForOptions = <T extends HTMLElement>(containerEl: HTMLElement, tagName: string, onChange: (el: T | undefined) => void) => {
  /* tslint:disable-next-line */
  if (typeof MutationObserver === 'undefined') { return; }

  const mutation = new MutationObserver(mutationList => {
    onChange(getSelectedOption<T>(mutationList, tagName));
  });
  mutation.observe(containerEl, {
    childList: true,
    subtree: true
  });
  return mutation;
};

const getSelectedOption = <T extends HTMLElement>(mutationList: MutationRecord[], tagName: string): T | undefined => {
  let newOption: HTMLElement | undefined;
  mutationList.forEach(mut => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < mut.addedNodes.length; i++) {
      newOption = findCheckedOption(mut.addedNodes[i], tagName) || newOption;
    }
  });
  return newOption as any;
};

export const findCheckedOption = (el: any, tagName: string) => {
  if (el.nodeType !== 1) {
    return undefined;
  }
  const options: HTMLElement[] = (el.tagName === tagName.toUpperCase())
    ? [el]
    : Array.from(el.querySelectorAll(tagName));

  return options.find((o: any) => o.value === el.value);
};
