

export function setupEvents(win: Window, doc: Document) {

  win.addEventListener('statusTap', () => {
    const centerElm = doc.elementFromPoint(win.innerWidth / 2, win.innerHeight / 2);
    if (centerElm) {
      const scrollElm = centerElm.closest('ion-scroll');
      if (scrollElm) {
        scrollElm.componentOnReady(() => scrollElm.scrollToTop(300));
      }
    }
  });

}
