
/**
 * Initializes a mutation observer to detect when the calendar month
 * text is updated as a result of a month change in `ion-datetime`.
 *
 * @param {*} datetimeSelector The element selector for the `ion-datetime` component.
 */
export function InitMonthDidChangeEvent(datetimeSelector = 'ion-datetime') {
  console.log("initing event");
  const observer = new MutationObserver(mutationRecords => {
    if (mutationRecords[0].type === 'characterData') {
      console.log("dispatching event");
      document.dispatchEvent(new CustomEvent('datetimeMonthDidChange'));
    }
  });

  console.log(document.querySelector(datetimeSelector));

  observer.observe(document.querySelector(datetimeSelector).shadowRoot.querySelector('.calendar-month-year'), {
    characterData: true,
    subtree: true
  });
}
