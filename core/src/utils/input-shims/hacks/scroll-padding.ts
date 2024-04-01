const PADDING_TIMER_KEY =
  '$ionPaddingTimer';

/**
 * Scroll padding adds additional padding to the bottom
 * of ion-content so that there is enough scroll space
 * for an input to be scrolled above the keyboard. This
 * is needed in environments where the webview does not
 * resize when the keyboard opens.
 *
 * Example: If an input at the bottom of ion-content is
 * focused, there is no additional scrolling space below
 * it, so the input cannot be scrolled above the keyboard.
 * Scroll padding fixes this by adding padding equal to the
 * height of the keyboard to the bottom of the content.
 *
 * Common environments where this is needed:
 * - Mobile Safari: The keyboard overlays the content
 * - Capacitor/Cordova on iOS: The keyboard overlays the content
 * when the KeyboardResize mode is set to 'none'.
 */
export const setScrollPadding = (
  contentEl: HTMLElement,
  paddingAmount: number,
  clearCallback?: () => void
) => {
  const timer = (contentEl as any)[
    PADDING_TIMER_KEY
  ];

  if (timer) {
    clearTimeout(timer);
  }

  if (paddingAmount > 0) {
    contentEl.style.setProperty(
      '--keyboard-offset',
      `${paddingAmount}px`
    );
  } else {
    (contentEl as any)[
      PADDING_TIMER_KEY
    ] = setTimeout(() => {
      contentEl.style.setProperty(
        '--keyboard-offset',
        '0px'
      );
      if (clearCallback) {
        clearCallback();
      }
    }, 120);
  }
};

/**
 * When an input is about to be focused,
 * set a timeout to clear any scroll padding
 * on the content. Note: The clearing
 * is done on a timeout so that if users
 * are moving focus from one input to the next
 * then re-adding scroll padding to the new
 * input with cancel the timeout to clear the
 * scroll padding.
 */
export const setClearScrollPaddingListener =
  (
    inputEl:
      | HTMLInputElement
      | HTMLTextAreaElement,
    contentEl: HTMLElement | null,
    doneCallback: () => void
  ) => {
    const clearScrollPadding = () => {
      if (contentEl) {
        setScrollPadding(
          contentEl,
          0,
          doneCallback
        );
      }
    };

    inputEl.addEventListener(
      'focusout',
      clearScrollPadding,
      { once: true }
    );
  };
