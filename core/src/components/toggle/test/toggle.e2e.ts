import { newE2EPage } from '@stencil/core/testing';

describe('toggle', () => {

  it('should create standalone, unchecked by default', async () => {
    // create a new e2e test page
    const page = await newE2EPage();

    // set the page content
    await page.setContent(`
      <ion-toggle class="some-class"></ion-toggle>
    `);

    // add an event spy to the page
    const ionChange = await page.spyOnEvent('ionChange');

    // find the elemnt in the page
    const toggle = await page.find('ion-toggle');

    // check it has the expected css classes
    expect(toggle).toHaveClass('some-class');
    expect(toggle).toHaveClass('hydrated');

    // toggle should not have checked css
    expect(toggle).not.toHaveClass('toggle-checked');

    // set checked property
    toggle.setProperty('checked', true);

    // wait for the changes to apply
    await page.waitForChanges();

    // make sure the property was updated
    const checkedValue1 = await toggle.getProperty('checked');
    expect(checkedValue1).toBe(true);

    // toggle should have checked css
    expect(toggle).toHaveClass('toggle-checked');

    // make sure we received the correct event detail
    expect(ionChange).toHaveReceivedEventDetail({
      checked: true,
      value: 'on'
    });

    // set unchecked
    toggle.setProperty('checked', false);

    // wait for the changes to apply
    await page.waitForChanges();

    // make sure the property was updated
    const checkedValue2 = await toggle.getProperty('checked');
    expect(checkedValue2).toBe(false);

    // toggle should not be checked
    expect(toggle).not.toHaveClass('toggle-checked');

    // we should have received the event two times now
    expect(ionChange).toHaveReceivedEventTimes(2);

    // make sure we received the correct event detail
    expect(ionChange).toHaveReceivedEventDetail({
      checked: false,
      value: 'on'
    });
  });

  it('should create standalone, checked by default', async () => {
    const page = await newE2EPage({ html: `
      <ion-toggle checked></ion-toggle>
    `});

    // find the elemnt in the page
    const toggle = await page.find('ion-toggle');

    // spy on the ionChange event
    const ionChange = await page.spyOnEvent('ionChange');

    // check aria
    expect(toggle).toEqualAttribute('aria-checked', 'true');

    // find the hidden input in the light dom
    const hiddenInput = await page.find('ion-toggle input[type=hidden]');

    // hidden input property should have value
    expect(hiddenInput).toEqualAttribute('value', 'on');

    // hidden in put should have aux-input class
    expect(hiddenInput).toHaveClass('aux-input');

    // set checked true again, no actual change
    toggle.setProperty('checked', true);

    // wait for the changes to apply
    await page.waitForChanges();

    // shouldn't have fired the ionChange event cuz it didn't change
    expect(ionChange).not.toHaveReceivedEvent();

    // uncheck
    toggle.setProperty('checked', false);

    // wait for the changes to apply
    await page.waitForChanges();

    // toggle should not be checked
    const checkedValue2 = await toggle.getProperty('checked');
    expect(checkedValue2).toBe(false);

    // hidden input property should no value
    expect(toggle).toEqualAttribute('aria-checked', 'false');

    expect(ionChange).toHaveReceivedEventTimes(1);

    expect(ionChange).toHaveReceivedEventDetail({
      checked: false,
      value: 'on'
    });
  });

  it('should pass properties down to hidden input', async () => {
    const page = await newE2EPage({ html: `
      <ion-toggle disabled checked value="coding" name="primary"></ion-toggle>
    `});

    const toggle = await page.find('ion-toggle');

    expect(await toggle.getProperty('disabled')).toBe(true);
    expect(await toggle.getProperty('checked')).toBe(true);
    expect(await toggle.getProperty('value')).toBe('coding');
    expect(await toggle.getProperty('name')).toBe('primary');

    const hiddenInput = await page.find('ion-toggle input[type=hidden]');

    expect(await hiddenInput.getProperty('disabled')).toBe(true);
    expect(await hiddenInput.getProperty('value')).toBe('coding');
    expect(await hiddenInput.getProperty('name')).toBe('primary');

    toggle.setProperty('disabled', false);
    toggle.setProperty('checked', false);
    toggle.setProperty('value', 'design');
    toggle.setProperty('name', 'secondary');

    await page.waitForChanges();

    expect(await hiddenInput.getProperty('disabled')).toBe(false);
    expect(await hiddenInput.getProperty('value')).toBe('');
    expect(await hiddenInput.getProperty('name')).toBe('secondary');
  });

});
