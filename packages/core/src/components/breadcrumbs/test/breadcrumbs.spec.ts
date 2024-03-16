import { newSpecPage } from '@stencil/core/testing';

import { Breadcrumb } from '../../breadcrumb/breadcrumb';
import { Breadcrumbs } from '../breadcrumbs';

it('should correctly provide the collapsed breadcrumbs in the event payload', async () => {
  const page = await newSpecPage({
    components: [Breadcrumbs, Breadcrumb],
    html: `
      <ion-breadcrumbs max-items="2" items-before-collapse="1" items-after-collapse="1">
        <ion-breadcrumb>First</ion-breadcrumb>
        <ion-breadcrumb>Second</ion-breadcrumb>
        <ion-breadcrumb>Third</ion-breadcrumb>
        <ion-breadcrumb>Fourth</ion-breadcrumb>
        <ion-breadcrumb>Fifth</ion-breadcrumb>
      </ion-breadcrumbs>
    `,
  });

  const onCollapsedClick = jest.fn((ev) => ev);
  const breadcrumbs = page.body.querySelector('ion-breadcrumbs')!;
  const breadcrumb = page.body.querySelectorAll('ion-breadcrumb')!;

  breadcrumbs.addEventListener('ionCollapsedClick', onCollapsedClick);

  const event = new CustomEvent('collapsedClick');
  breadcrumbs.dispatchEvent(event);

  expect(onCollapsedClick).toHaveBeenCalledTimes(1);

  const collapsedBreadcrumbs = onCollapsedClick.mock.calls[0][0].detail.collapsedBreadcrumbs;
  expect(collapsedBreadcrumbs.length).toEqual(3);
  expect(collapsedBreadcrumbs[0]).toBe(breadcrumb[1]);
  expect(collapsedBreadcrumbs[1]).toBe(breadcrumb[2]);
  expect(collapsedBreadcrumbs[2]).toBe(breadcrumb[3]);
});

it('should exclude the separator from narrators', async () => {
  const page = await newSpecPage({
    components: [Breadcrumbs, Breadcrumb],
    html: `
      <ion-breadcrumbs>
        <ion-breadcrumb>First</ion-breadcrumb>
        <ion-breadcrumb>Second</ion-breadcrumb>
      </ion-breadcrumbs>
    `,
  });

  const firstBreadcrumb = page.body.querySelector('ion-breadcrumb:first-of-type')!;
  const separator = firstBreadcrumb.shadowRoot!.querySelector('[part="separator"]')!;

  expect(separator.getAttribute('aria-hidden')).toBe('true');
});

it('should have color attribute', async () => {
  const page = await newSpecPage({
    components: [Breadcrumb, Breadcrumbs],
    html: `
      <ion-breadcrumbs color="danger">
        <ion-breadcrumb>First</ion-breadcrumb>
      </ion-breadcrumbs>
    `,
  });

  const breadcrumbs = page.body.querySelector('ion-breadcrumbs')!;

  expect(breadcrumbs.hasAttribute('color')).toBe(true);
});
