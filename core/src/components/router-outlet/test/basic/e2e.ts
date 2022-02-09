import { newE2EPage } from '@stencil/core/testing';

test('getRouteId() should return the segment parameters', async () => {
  const page = await newE2EPage({
    url: '/src/components/router-outlet/test/basic?ionic:_testing=true'
  });  


  await page.$eval('ion-item[href="#/two/segment"] ion-label', (el: any) => el.click());
  await page.waitForChanges();
  const routeId = await page.$eval('ion-router-outlet', async (el: any) => await el.getRouteId());

  expect(routeId.id).toEqual('PAGE-TWO');
  expect(routeId.params).toEqual({ param: 'segment' });
});

test('getRouteId() should return the route parameters', async () => {
  const page = await newE2EPage({
    url: '/src/components/router-outlet/test/basic?ionic:_testing=true'
  });  


  await page.$eval('ion-item[href="#/page-3"] ion-label', (el: any) => el.click());
  await page.waitForChanges();
  const routeId = await page.$eval('ion-router-outlet', async (el: any) => await el.getRouteId());

  expect(routeId.id).toEqual('PAGE-THREE');
  expect(routeId.params).toEqual({ param: 'route' });
});