import { newE2EPage } from '@stencil/core/testing';

describe('menu', () => {

  it('should open menu', async () => {
    // create a new e2e test page
    const page = await newE2EPage({
      html: `
      <ion-app>
        <ion-menu type="overlay">
          <ion-content>Content</ion-content>
        </ion-menu>
        <div main></div>
      </ion-app>
      `
    });

    const menu = await page.find('ion-menu');

    expect(menu).toHaveClasses([
      'menu-type-overlay',
      'menu-enabled',
      'menu-side-start',
    ]);

    await menu.callMethod('open', false);
    await page.waitForChanges();

    expect(menu).toHaveClasses([
      'menu-type-overlay',
      'menu-enabled',
      'menu-side-start',
    ]);
  });
});
