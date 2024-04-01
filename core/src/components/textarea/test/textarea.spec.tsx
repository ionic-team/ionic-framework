import { newSpecPage } from '@stencil/core/testing';
import { Textarea } from '../textarea';

it('should render bottom content when helper text is defined', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: `<ion-textarea label="Textarea" helper-text="Helper Text"></ion-textarea>`,
  });

  const bottomContent =
    page.body.querySelector(
      'ion-textarea .textarea-bottom'
    );
  expect(bottomContent).not.toBe(null);
});

it('should render bottom content when helper text is undefined', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: `<ion-textarea label="Textarea"></ion-textarea>`,
  });

  const bottomContent =
    page.body.querySelector(
      'ion-textarea .textarea-bottom'
    );
  expect(bottomContent).toBe(null);
});

it('should render bottom content when helper text is empty string', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: `<ion-textarea label="Textarea" helper-text=""></ion-textarea>`,
  });

  const bottomContent =
    page.body.querySelector(
      'ion-textarea .textarea-bottom'
    );
  expect(bottomContent).toBe(null);
});
