import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (msg) => console.log('CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));

await page.goto('http://localhost:3333/#');
await page.route('http://localhost:3333/', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: `<!DOCTYPE html>
<html><head>
<link href="http://localhost:3333/css/ionic.bundle.css" rel="stylesheet" />
<script type="module" src="http://localhost:3333/dist/loader-bundle/ionic/ionic.esm.js"></script>
</head><body>
<ion-reorder-group disabled="false">
  <ion-item><ion-label>Item 1</ion-label><ion-reorder slot="end"></ion-reorder></ion-item>
  <ion-item><ion-label>Item 2</ion-label><ion-reorder slot="end"></ion-reorder></ion-item>
</ion-reorder-group>
</body></html>`,
  });
});
await page.goto('http://localhost:3333/#');
await page.waitForTimeout(1000);

const info = await page.evaluate(async () => {
  const rg = document.querySelector('ion-reorder-group');
  await customElements.whenDefined('ion-reorder-group');
  return {
    hasGesture: !!(rg).gesture,
    tagName: rg.tagName,
  };
});
console.log('INFO:', JSON.stringify(info));

const reorderHandle = await page.$('ion-reorder');
const box = await reorderHandle.boundingBox();
console.log('BOX:', JSON.stringify(box));

await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
await page.mouse.down();
await page.mouse.move(box.x + box.width/2, box.y + box.height/2 + 60, { steps: 10 });
await page.waitForTimeout(200);

const state = await page.evaluate(() => {
  const rg = document.querySelector('ion-reorder-group');
  return { state: rg.state, selectedItemEl: !!(rg).selectedItemEl };
});
console.log('STATE:', JSON.stringify(state));

await page.mouse.up();
await browser.close();
