import { newSpecPage } from '@stencil/core/testing';
import { Textarea } from '../textarea';

it('should inherit attributes', async () => {
  const page = await newSpecPage({
    components: [Textarea],
    html: '<ion-textarea title="my title" tabindex="-1" data-form-type="password"></ion-textarea>',
  });

  const nativeEl = page.body.querySelector('ion-textarea textarea');
  expect(nativeEl.getAttribute('title')).toBe('my title');
  expect(nativeEl.getAttribute('tabindex')).toBe('-1');
  expect(nativeEl.getAttribute('data-form-type')).toBe('password');
});
