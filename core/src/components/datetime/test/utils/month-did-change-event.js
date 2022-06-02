/**
 * Initializes a mutation observer to detect when the calendar month
 * text is updated as a result of a month change in `ion-datetime`.
 *
 * @param {*} datetimeSelector The element selector for the `ion-datetime` component.
 */
export function InitMonthDidChangeEvent(datetimeSelector = 'ion-datetime') {
  const observer = new MutationObserver((mutationRecords) => {
    if (mutationRecords[0].type === 'characterData') {
      window.dispatchEvent(new CustomEvent('datetimeMonthDidChange'));
    }
  });

  observer.observe(document.querySelector(datetimeSelector).shadowRoot.querySelector('.calendar-month-year'), {
    characterData: true,
    subtree: true,
  });
}
