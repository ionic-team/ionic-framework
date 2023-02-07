import { newSpecPage } from '@stencil/core/testing';
import { Input } from '../input';

it('should render bottom content when helper text is defined', async () => {
  const page = await newSpecPage({
    components: [Input],
    html: `<ion-input label="Input" helper-text="Helper Text"></ion-input>`,
  });

  const bottomContent = page.body.querySelector('ion-input .input-bottom');
  expect(bottomContent).not.toBe(null);
});

it('should render bottom content when helper text is undefined', async () => {
  const page = await newSpecPage({
    components: [Input],
    html: `<ion-input label="Input"></ion-input>`,
  });

  const bottomContent = page.body.querySelector('ion-input .input-bottom');
  expect(bottomContent).toBe(null);
});

it('should render bottom content when helper text is empty string', async () => {
  const page = await newSpecPage({
    components: [Input],
    html: `<ion-input label="Input" helper-text=""></ion-input>`,
  });

  const bottomContent = page.body.querySelector('ion-input .input-bottom');
  expect(bottomContent).toBe(null);
});
