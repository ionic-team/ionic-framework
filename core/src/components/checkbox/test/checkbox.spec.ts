import { newSpecPage } from '@stencil/core/testing';

import { config } from '../../../global/config';
import { Checkbox } from '../checkbox';

describe('ion-checkbox: shadow parts', () => {
  it('should render the checkbox with shadow parts', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox>Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;

    expect(checkbox).toHaveShadowPart('container');
    expect(checkbox).toHaveShadowPart('label');
    expect(checkbox).toHaveShadowPart('icon');
    expect(checkbox).toHaveShadowPart('mark');
  });
});

describe('ion-checkbox: disabled', () => {
  it('clicking disabled checkbox should not toggle checked state', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox disabled="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;

    expect(checkbox.checked).toBe(false);

    checkbox.click();

    await page.waitForChanges();

    expect(checkbox.checked).toBe(false);
  });
});

describe('ion-checkbox: indeterminate', () => {
  it('should have a mixed value for aria-checked', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox indeterminate="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;

    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
  });
});

describe('ion-checkbox: required', () => {
  it('should have a required attribute in inner input when true', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox required="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;
    const nativeInput = checkbox.shadowRoot?.querySelector('input[type=checkbox]')!;

    expect(nativeInput.hasAttribute('required')).toBeTruthy();
  });

  it('should not have a required attribute in inner input when false', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox required="false">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;
    const nativeInput = checkbox.shadowRoot?.querySelector('input[type=checkbox]')!;

    expect(nativeInput.hasAttribute('required')).toBeFalsy();
  });
});

describe('ion-checkbox: icon', () => {
  beforeEach(() => {
    config.reset({});
  });

  it('should slot the default svg when no icon is set in the config', async () => {
    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox checked="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;
    const icon = checkbox.shadowRoot?.querySelector('.checkbox-icon')!;

    expect(icon.tagName.toLowerCase()).toBe('ion-icon');
    expect(icon.hasAttribute('icon')).toBe(false);
    expect(icon.querySelector('svg path')).not.toBeNull();
  });

  it('should pass the checked icon set in the config to the icon', async () => {
    config.reset({ checkboxCheckedIcon: 'custom-checked-icon' });

    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox checked="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;
    const icon = checkbox.shadowRoot?.querySelector('.checkbox-icon')!;

    expect(icon.getAttribute('icon')).toBe('custom-checked-icon');
  });

  it('should pass the indeterminate icon set in the config to the icon', async () => {
    config.reset({ checkboxIndeterminateIcon: 'custom-indeterminate-icon' });

    const page = await newSpecPage({
      components: [Checkbox],
      html: `
        <ion-checkbox indeterminate="true">Checkbox</ion-checkbox>
      `,
    });

    const checkbox = page.body.querySelector('ion-checkbox')!;
    const icon = checkbox.shadowRoot?.querySelector('.checkbox-icon')!;

    expect(icon.getAttribute('icon')).toBe('custom-indeterminate-icon');
  });
});
