import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Item } from '../item';

describe('item', () => {
  it('should change focusable option after switching button option status', async () => {
    const page = await newSpecPage({
      components: [Item],
      template: () => <ion-item button={false}></ion-item>,
    });

    const item = page.body.querySelector('ion-item')!;
    // Change button attribute to true
    item.setAttribute('button', 'true');

    await page.waitForChanges();

    // Check if it has the expected class that gives the focused styles to the item element
    expect(item).toHaveClass('ion-focusable');
  });

  describe('focus indicator room', () => {
    const newItemPage = async (html: string) => {
      const page = await newSpecPage({ components: [Item], html });

      // The slotted-control check runs in a raf after load, so let the frame
      // callback fire before asserting on the rendered class.
      await new Promise((resolve) => setTimeout(resolve, 0));
      await page.waitForChanges();

      return page.body.querySelector('ion-item')!;
    };

    it('should reserve room for a control in the default slot of a multi-input item', async () => {
      const item = await newItemPage(
        `<ion-item><ion-checkbox>One</ion-checkbox><ion-checkbox>Two</ion-checkbox></ion-item>`
      );

      expect(item).toHaveClass('item-focus-indicator-room');
    });

    it('should reserve room for a control in the default slot of a clickable item', async () => {
      const item = await newItemPage(`<ion-item button><ion-toggle>Label</ion-toggle></ion-item>`);

      expect(item).toHaveClass('item-focus-indicator-room');
    });

    it('should reserve room for a control nested below the slotted element', async () => {
      const item = await newItemPage(`<ion-item button><div><ion-radio>Label</ion-radio></div></ion-item>`);

      expect(item).toHaveClass('item-focus-indicator-room');
    });

    // A lone control has the item's input cover and lets the item draw the indicator,
    // so there's nothing overhanging the wrapper to make room for.
    it('should not reserve room for a control that defers its indicator to the item', async () => {
      const item = await newItemPage(`<ion-item><ion-checkbox>Label</ion-checkbox></ion-item>`);

      expect(item).not.toHaveClass('item-focus-indicator-room');
    });

    it('should not reserve room for controls outside the default slot', async () => {
      const item = await newItemPage(
        `<ion-item><ion-toggle slot="start">Start</ion-toggle>Text<ion-toggle slot="end">End</ion-toggle></ion-item>`
      );

      expect(item).not.toHaveClass('item-focus-indicator-room');
    });

    it('should not reserve room when no control is slotted', async () => {
      const item = await newItemPage(`<ion-item><ion-label>Label</ion-label></ion-item>`);

      expect(item).not.toHaveClass('item-focus-indicator-room');
    });
  });

  describe('rtl', () => {
    const newItemPage = async (html: string, documentDir?: 'rtl') => {
      const page = await newSpecPage({ components: [Item], html: `<div></div>` });
      if (documentDir) {
        page.doc.documentElement.setAttribute('dir', documentDir);
      }
      await page.setContent(html);
      return page.body.querySelector('ion-item')!;
    };

    it('should set item-rtl when it declares rtl', async () => {
      const item = await newItemPage(`<ion-item dir="rtl">Item</ion-item>`);
      expect(item).toHaveClass('item-rtl');
    });

    it('should set item-rtl when an ancestor declares rtl', async () => {
      const item = await newItemPage(`<div dir="rtl"><div><ion-item>Item</ion-item></div></div>`);
      expect(item).toHaveClass('item-rtl');
    });

    it('should not set item-rtl when an ancestor declares ltr in an rtl document', async () => {
      const item = await newItemPage(`<div dir="ltr"><div><ion-item>Item</ion-item></div></div>`, 'rtl');
      expect(item).not.toHaveClass('item-rtl');
    });
  });
});

describe('item: tabindex', () => {
  it('should move tabindex from the host to the native button of a clickable item', async () => {
    const page = await newSpecPage({
      components: [Item],
      html: '<ion-item button tabindex="0">Settings</ion-item>',
    });

    const item = page.body.querySelector('ion-item')!;
    const nativeEl = item.shadowRoot!.querySelector('button')!;

    expect(item.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should keep tabindex on the host of an item that is not clickable', async () => {
    const page = await newSpecPage({
      components: [Item],
      html: '<ion-item tabindex="0">Settings</ion-item>',
    });

    const item = page.body.querySelector('ion-item')!;
    const nativeEl = item.shadowRoot!.querySelector('.item-native')!;

    expect(item.getAttribute('tabindex')).toBe('0');
    expect(nativeEl.hasAttribute('tabindex')).toBe(false);
  });

  it('should move tabindex from the host to the native anchor of an item with an href', async () => {
    const page = await newSpecPage({
      components: [Item],
      html: '<ion-item href="#" tabindex="0">Settings</ion-item>',
    });

    const item = page.body.querySelector('ion-item')!;
    const nativeEl = item.shadowRoot!.querySelector('a')!;

    expect(item.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex off the host when the item becomes clickable', async () => {
    const page = await newSpecPage({
      components: [Item],
      html: '<ion-item tabindex="0">Settings</ion-item>',
    });

    const item = page.body.querySelector('ion-item')!;
    item.button = true;
    await page.waitForChanges();

    const nativeEl = item.shadowRoot!.querySelector('button')!;

    expect(item.hasAttribute('tabindex')).toBe(false);
    expect(nativeEl.getAttribute('tabindex')).toBe('0');
  });

  it('should move tabindex back onto the host when the item stops being clickable', async () => {
    const page = await newSpecPage({
      components: [Item],
      html: '<ion-item href="#" tabindex="0">Settings</ion-item>',
    });

    const item = page.body.querySelector('ion-item')!;
    item.href = undefined;
    await page.waitForChanges();

    const nativeEl = item.shadowRoot!.querySelector('.item-native')!;

    expect(item.getAttribute('tabindex')).toBe('0');
    expect(nativeEl.hasAttribute('tabindex')).toBe(false);
  });
});
