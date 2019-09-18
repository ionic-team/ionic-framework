
const SCROLL_ASSIST_SPEED = 0.3;

export interface ScrollData {
  scrollAmount: number;
  scrollPadding: number;
  scrollDuration: number;
  inputSafeY: number;
}

export const getScrollData = (itemEl: HTMLElement, contentEl: HTMLElement, keyboardHeight: number): ScrollData => {
  return calcScrollData(
    itemEl.getBoundingClientRect(),
    contentEl.getBoundingClientRect(),
    keyboardHeight,
    (itemEl as any).ownerDocument.defaultView.innerHeight
  );
};

const calcScrollData = (
  inputRect: ClientRect,
  contentRect: ClientRect,
  keyboardHeight: number,
  platformHeight: number
): ScrollData => {
  // compute input's Y values relative to the body
  const inputTop = inputRect.top;
  const inputBottom = inputRect.bottom;

  // compute visible area
  const visibleAreaTop = contentRect.top + 15;
  const visibleAreaBottom = Math.min(contentRect.bottom, platformHeight - keyboardHeight) - 15 ;

  // compute safe area
  // const safeAreaTop = visibleAreaTop + 15;
  // const safeAreaBottom = visibleAreaBottom * 0.5;

  // figure out if each edge of the input is within the safe area
  const distanceToBottom = visibleAreaBottom - inputBottom;
  const distanceToTop = visibleAreaTop - inputTop;

  // desiredScrollAmount is the negated distance to the safe area according to our calculations.
  const scrollAmount = Math.round((distanceToBottom < 0)
    ? -distanceToBottom
    : (distanceToTop > 0)
      ? -distanceToTop
      : 0);

  // our calculations make some assumptions that aren't always true, like the keyboard being closed when an input
  // gets focus, so make sure we don't scroll the input above the visible area
  const distance = Math.abs(scrollAmount);
  const duration = distance / SCROLL_ASSIST_SPEED;
  const scrollDuration = Math.min(400, Math.max(150, duration));

  return {
    scrollAmount,
    scrollDuration,
    scrollPadding: keyboardHeight,
    inputSafeY: -(inputTop - visibleAreaTop) + 4
  };
};
