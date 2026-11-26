import { newSpecPage } from '@stencil/core/testing';

import { Tab } from '../../tab/tab';
import { Tabs } from '../tabs';

describe('tabs: getTab', () => {
  it('should name the requested tab when it does not exist', async () => {
    const page = await newSpecPage({
      components: [Tabs, Tab],
      html: `
        <ion-tabs>
          <ion-tab tab="home">Home</ion-tab>
        </ion-tabs>
      `,
    });

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const tabs = page.body.querySelector('ion-tabs')!;
    const tab = await tabs.getTab('settings');

    expect(tab).toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith('[Ionic Error]: [ion-tabs] - Tab with id: "settings" does not exist');

    consoleError.mockRestore();
  });
});
