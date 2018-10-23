// 'use strict';

// const { register, Page, platforms } = require('../../../../../scripts/e2e');
// const { getElement, waitAndGetElementById, waitForTransition } = require('../../../../../scripts/e2e/utils');

// class E2ETestPage extends Page {
//   constructor(driver, platform) {
//     super(driver, `http://localhost:3333/src/components/tabs/test/vanilla?ionic:mode=${platform}`);
//   }
// }

// platforms.forEach(platform => {
//   describe('tabs/vanilla', () => {
//     register('should init', driver => {
//       const page = new E2ETestPage(driver, platform);
//       return page.navigate();
//     });

//     register('should check each tab', async (driver, testContext) => {
//       testContext.timeout(60000);
//       const page = new E2ETestPage(driver, platform);

//       await waitForTransition(300);

//       const tabTwoButton = await waitAndGetElementById(driver, 'tab-t-0-1');
//       tabTwoButton.click();
//       await waitForTransition(600);

//       const tabThreeButton = await waitAndGetElementById(driver, 'tab-t-0-2');
//       tabThreeButton.click();
//       await waitForTransition(600);
//     });
//   });
// });
