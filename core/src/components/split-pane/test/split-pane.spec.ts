import { newSpecPage } from '@stencil/core/testing';
import * as breakpoints from '@utils/breakpoints';

import { SplitPane } from '../split-pane';

/**
 * A `when` shortcut is resolved to a media query string once, so the query is
 * rebuilt when the configured widths change.
 */
describe('ion-split-pane', () => {
  const renderSubscribedSplitPane = async () => {
    const unsubscribe = jest.fn();
    const subscribe = jest.spyOn(breakpoints, 'onBreakpointChange').mockReturnValue(unsubscribe);

    const page = await newSpecPage({ components: [SplitPane], html: `<div id="host"></div>` });

    const splitPane = page.doc.createElement('ion-split-pane');
    splitPane.when = 'lg';
    page.body.querySelector('#host')!.appendChild(splitPane);
    await page.waitForChanges();

    return { page, splitPane, subscribe, unsubscribe };
  };

  it('subscribes to breakpoint changes while connected', async () => {
    const { subscribe, unsubscribe } = await renderSubscribedSplitPane();

    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).not.toHaveBeenCalled();

    subscribe.mockRestore();
  });

  it('unsubscribes once the split pane is disconnected', async () => {
    const { page, splitPane, subscribe, unsubscribe } = await renderSubscribedSplitPane();

    splitPane.remove();
    await page.waitForChanges();

    expect(unsubscribe).toHaveBeenCalledTimes(1);

    subscribe.mockRestore();
  });

  /**
   * `connectedCallback` awaits the element being defined, so it can resolve
   * after the element has already been disconnected, when nothing is left to
   * tear down what it sets up.
   */
  it('does not subscribe when disconnected before connecting finishes', async () => {
    const unsubscribe = jest.fn();
    const subscribe = jest.spyOn(breakpoints, 'onBreakpointChange').mockReturnValue(unsubscribe);

    const page = await newSpecPage({ components: [SplitPane], html: `<div id="host"></div>` });
    const host = page.body.querySelector('#host')!;

    const splitPane = page.doc.createElement('ion-split-pane');
    host.appendChild(splitPane);
    splitPane.remove();
    await page.waitForChanges();

    expect(subscribe).not.toHaveBeenCalled();

    subscribe.mockRestore();
  });
});
