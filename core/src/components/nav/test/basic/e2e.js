// 'use strict';

// const { register, Page, platforms } = require('../../../../../scripts/e2e');
// const { getElement, waitForTransition } = require('../../../../../scripts/e2e/utils');

// class E2ETestPage extends Page {
//   constructor(driver, platform) {
//     super(driver, `http://localhost:3333/src/components/nav/test/basic?ionic:mode=${platform}`);
//   }
// }

// platforms.forEach(platform => {
//   describe('nav/basic', () => {

//     register('should init', driver => {
//       const page = new E2ETestPage(driver, platform);
//       return page.navigate();
//     });

//     register('should go to page-one, page-two, page-three, then back to page-two, page-one', async (driver, testContext) => {

//       testContext.timeout(10000);
//       const page = new E2ETestPage(driver, platform);

//       // go to page two
//       const pageOneNextButtonSelector = '.first-page ion-button.next.hydrated';
//       const pageOneNextButton = await getElement(driver, pageOneNextButtonSelector);
//       pageOneNextButton.click();
//       await waitForTransition(600);

//       // go to page three
//       const pageTwoNextButtonSelector = '.second-page ion-button.next.hydrated';
//       const pageTwoNextButton = await getElement(driver, pageTwoNextButtonSelector);
//       pageTwoNextButton.click();
//       await waitForTransition(600);

//       // go back to page two
//       const pageThreeBackButtonSelector = '.third-page ion-button.previous.hydrated';
//       const pageThreeBackButton = await getElement(driver, pageThreeBackButtonSelector);
//       pageThreeBackButton.click();
//       await waitForTransition(600);

//       // go back to page two
//       const pageTwoBackButtonSelector = '.second-page ion-button.previous.hydrated';
//       const pageTwoBackButton = await getElement(driver, pageTwoBackButtonSelector);
//       pageTwoBackButton.click();
//       await waitForTransition(600);

//       // we're back on page one now
//     });
//   });
// });
