export function clonePageElement(leavingViewHtml: string) {
  if (document) {
    const newEl = document.createElement('div');
    newEl.innerHTML = leavingViewHtml;
    newEl.style.zIndex = '';
    // Remove an existing back button so the new element doesn't get two of them
    const ionBackButton = newEl.getElementsByTagName('ion-back-button');
    if (ionBackButton[0]) {
      ionBackButton[0].innerHTML = '';
    }
    return newEl.firstChild as HTMLElement;
  }
  return undefined;
}
