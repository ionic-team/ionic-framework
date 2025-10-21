import { newSpecPage } from '@stencil/core/testing';

import type { AccordionGroupChangeEventDetail } from '../../accordion-group/accordion-group-interface';
import { AccordionGroup } from '../../accordion-group/accordion-group';
import { Item } from '../../item/item';
import { Accordion } from '../accordion';

it('should open correct accordions when accordion group value is set', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group animated="false">
        <ion-accordion value="first">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="second">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="third">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;
  const accordions = accordionGroup.querySelectorAll('ion-accordion');

  accordions.forEach((accordion) => {
    expect(accordion.classList.contains('accordion-collapsed')).toEqual(true);
  });

  accordionGroup.value = 'second';
  await page.waitForChanges();

  expect(accordions[0].classList.contains('accordion-collapsed')).toEqual(true);
  expect(accordions[1].classList.contains('accordion-collapsed')).toEqual(false);
  expect(accordions[2].classList.contains('accordion-collapsed')).toEqual(true);
});

it('should open correct accordions when accordion value is set', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group animated="false" value="first">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="second">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="third">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;
  const accordions = accordionGroup.querySelectorAll('ion-accordion');

  accordions.forEach((accordion) => {
    expect(accordion.classList.contains('accordion-collapsed')).toEqual(true);
  });

  accordions[0].value = 'first';
  await page.waitForChanges();

  expect(accordions[0].classList.contains('accordion-collapsed')).toEqual(false);
  expect(accordions[1].classList.contains('accordion-collapsed')).toEqual(true);
  expect(accordions[2].classList.contains('accordion-collapsed')).toEqual(true);
});

it('should open more than one accordion when multiple="true"', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group multiple="true" animated="false">
        <ion-accordion value="first">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="second">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="third">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;
  const accordions = accordionGroup.querySelectorAll('ion-accordion');

  accordions.forEach((accordion) => {
    expect(accordion.classList.contains('accordion-collapsed')).toEqual(true);
  });

  accordionGroup.value = ['first', 'second'];
  await page.waitForChanges();

  expect(accordions[0].classList.contains('accordion-collapsed')).toEqual(false);
  expect(accordions[1].classList.contains('accordion-collapsed')).toEqual(false);
  expect(accordions[2].classList.contains('accordion-collapsed')).toEqual(true);
});

it('should render with accordion open', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group value="first" animated="false">
        <ion-accordion value="first">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="second">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="third">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;
  const accordions = accordionGroup.querySelectorAll('ion-accordion');

  expect(accordions[0].classList.contains('accordion-collapsed')).toEqual(false);
  expect(accordions[1].classList.contains('accordion-collapsed')).toEqual(true);
  expect(accordions[2].classList.contains('accordion-collapsed')).toEqual(true);
});

it('should accept a string when multiple="true"', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group multiple="true" value="first" animated="false">
        <ion-accordion value="first">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="second">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
        <ion-accordion value="third">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;
  const accordions = accordionGroup.querySelectorAll('ion-accordion');

  expect(accordions[0].classList.contains('accordion-collapsed')).toEqual(false);
  expect(accordions[1].classList.contains('accordion-collapsed')).toEqual(true);
  expect(accordions[2].classList.contains('accordion-collapsed')).toEqual(true);
});

it('should set default values if not provided', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group animated="false">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;
  const accordion = accordionGroup.querySelector('ion-accordion')!;

  /**
   * ID is determined via an auto incrementing counter
   * so do not hard code ion-accordion-0 as it might
   * change depending on how many accordions
   * are used in these tests.
   */
  expect(accordion.value).toContain('ion-accordion-');

  accordionGroup.value = accordion.value;
  await page.waitForChanges();

  expect(accordion.classList.contains('accordion-collapsed')).toEqual(false);
});

it('should not animate when initial value is set before load', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
  });

  const accordionGroup = page.doc.createElement('ion-accordion-group');
  accordionGroup.innerHTML = `
    <ion-accordion value="first">
      <ion-item slot="header">Label</ion-item>
      <div slot="content">Content</div>
    </ion-accordion>
    <ion-accordion value="second">
      <ion-item slot="header">Label</ion-item>
      <div slot="content">Content</div>
    </ion-accordion>
  `;

  const details: AccordionGroupChangeEventDetail[] = [];
  accordionGroup.addEventListener('ionValueChange', (event: CustomEvent<AccordionGroupChangeEventDetail>) => {
    details.push(event.detail);
  });

  accordionGroup.value = 'first';
  page.body.appendChild(accordionGroup);

  await page.waitForChanges();

  expect(details[0]?.initial).toBe(true);

  const firstAccordion = accordionGroup.querySelector('ion-accordion[value="first"]')!;

  expect(firstAccordion.classList.contains('accordion-expanded')).toEqual(true);
  expect(firstAccordion.classList.contains('accordion-expanding')).toEqual(false);
  expect(firstAccordion.classList.contains('accordion-animated')).toEqual(false);
});

it('should not animate when initial value is set after load', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
  });

  const accordionGroup = page.doc.createElement('ion-accordion-group');
  accordionGroup.innerHTML = `
    <ion-accordion value="first">
      <ion-item slot="header">Label</ion-item>
      <div slot="content">Content</div>
    </ion-accordion>
    <ion-accordion value="second">
      <ion-item slot="header">Label</ion-item>
      <div slot="content">Content</div>
    </ion-accordion>
  `;

  const details: AccordionGroupChangeEventDetail[] = [];
  accordionGroup.addEventListener('ionValueChange', (event: CustomEvent<AccordionGroupChangeEventDetail>) => {
    details.push(event.detail);
  });

  page.body.appendChild(accordionGroup);
  await page.waitForChanges();

  accordionGroup.value = 'first';
  await page.waitForChanges();

  const firstDetail = details.find((detail) => detail.value === 'first');
  expect(firstDetail?.initial).toBe(true);

  const firstAccordion = accordionGroup.querySelector('ion-accordion[value="first"]')!;

  expect(firstAccordion.classList.contains('accordion-expanded')).toEqual(true);
  expect(firstAccordion.classList.contains('accordion-expanding')).toEqual(false);
  expect(firstAccordion.classList.contains('accordion-animated')).toEqual(false);
});

it('should animate when accordion is first opened by user', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group>
        <ion-accordion value="first">
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;

  const details: AccordionGroupChangeEventDetail[] = [];
  accordionGroup.addEventListener('ionValueChange', (event: CustomEvent<AccordionGroupChangeEventDetail>) => {
    details.push(event.detail);
  });

  await accordionGroup.requestAccordionToggle('first', true);
  await page.waitForChanges();

  const lastDetail = details[details.length - 1];
  expect(lastDetail?.initial).toBe(false);

  const firstAccordion = accordionGroup.querySelector('ion-accordion[value="first"]')!;
  expect(firstAccordion.classList.contains('accordion-animated')).toEqual(true);
});

// Verifies fix for https://github.com/ionic-team/ionic-framework/issues/27047
it('should not have animated class when animated="false"', async () => {
  const page = await newSpecPage({
    components: [Item, Accordion, AccordionGroup],
    html: `
      <ion-accordion-group animated="false">
        <ion-accordion>
          <ion-item slot="header">Label</ion-item>
          <div slot="content">Content</div>
        </ion-accordion>
      </ion-accordion-group>
    `,
  });

  const accordionGroup = page.body.querySelector('ion-accordion-group')!;
  const accordion = accordionGroup.querySelector('ion-accordion')!;

  expect(accordionGroup.animated).toEqual(false);
  expect(accordion.classList.contains('accordion-animated')).toEqual(false);
});
