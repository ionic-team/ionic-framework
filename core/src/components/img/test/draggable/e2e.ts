import { newE2EPage } from '@stencil/core/testing';

test('img: draggable', async () => {
  const page = await newE2EPage({
    url: '/src/components/img/test/draggable?ionic:_testing=true',
  });

  const imgDraggableTrue = await page.find('#img-draggable-true >>> img');
  expect(imgDraggableTrue.getAttribute('draggable')).toEqual('true');

  const imgDraggableFalse = await page.find('#img-draggable-false >>> img');
  expect(imgDraggableFalse.getAttribute('draggable')).toEqual('false');

  const imgDraggableUnset = await page.find('#img-draggable-unset >>> img');
  expect(imgDraggableUnset.getAttribute('draggable')).toEqual(null);
});
