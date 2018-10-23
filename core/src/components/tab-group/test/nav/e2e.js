// 'use strict';

// const expect = require('chai').expect;
// const { register, Page, platforms } = require('../../../../../scripts/e2e');
// const { getElement, waitAndGetElementById, waitForTransition } = require('../../../../../scripts/e2e/utils');

// class E2ETestPage extends Page {
//   constructor(driver, platform) {
//     super(driver, `http://localhost:3333/src/components/tabs/test/nav?ionic:mode=${platform}`);
//   }
// }

// platforms.forEach(platform => {
//   describe('tabs/nav', () => {
//     register('should init', driver => {
//       const page = new E2ETestPage(driver, platform);
//       return page.navigate();
//     });

//     register('should push three pages on each nav stack', async (driver, testContext) => {

//       testContext.timeout(60000);
//       const page = new E2ETestPage(driver, platform);

//       await waitForTransition(300);

//       console.log('On Tab One Page One');
//       const tabOnePageOneNextButtonSelector = 'page-one ion-button.next.hydrated';
//       const tabOnePageOneNextButton = await getElement(driver, tabOnePageOneNextButtonSelector);
//       tabOnePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Tab One Page Two');
//       const tabOnePageTwoNextButtonSelector = 'page-two ion-button.next.hydrated';
//       const tabOnePageTwoNextButton = await getElement(driver, tabOnePageTwoNextButtonSelector);
//       tabOnePageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Tab One Page Three');

//       console.log('Switching to Tab Two');
//       const tabTwoButton = await waitAndGetElementById(driver, 'tab-t-0-1');
//       tabTwoButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Two Page One');
//       const tabTwoPageOneNextButtonSelector = 'page-four ion-button.next.hydrated';
//       const tabTwoPageOneNextButton = await getElement(driver, tabTwoPageOneNextButtonSelector);
//       tabTwoPageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Two Page Two');
//       const tabTwoPageTwoNextButtonSelector = 'page-five ion-button.next.hydrated';
//       const tabTwoPageTwoNextButton = await getElement(driver, tabTwoPageTwoNextButtonSelector);
//       tabTwoPageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Tab two Page Three');

//       console.log('Switching to Tab Three');
//       const tabThreeButton = await waitAndGetElementById(driver, 'tab-t-0-2');
//       tabThreeButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Three Page One');
//       const tabThreePageOneNextButtonSelector = 'page-seven ion-button.next.hydrated';
//       const tabThreePageOneNextButton = await getElement(driver, tabThreePageOneNextButtonSelector);
//       tabThreePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Two Page Two');
//       const tabThreePageTwoNextButtonSelector = 'page-eight ion-button.next.hydrated';
//       const tabThreePageTwoNextButton = await getElement(driver, tabThreePageTwoNextButtonSelector);
//       tabThreePageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Three Page Three');

//       console.log('Switching to Tab One');
//       const tabOneButton = await waitAndGetElementById(driver, 'tab-t-0-0');
//       tabOneButton.click();
//       await waitForTransition(600);

//       console.log('On Tab One Page Three');
//       const tabOnePageThreeBackButtonSelector = 'page-three ion-button.back.hydrated';
//       const tabOnePageThreeBackButton = await getElement(driver, tabOnePageThreeBackButtonSelector);
//       tabOnePageThreeBackButton.click();
//       await waitForTransition(600);

//       console.log('Switching to Tab Three');
//       tabThreeButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Three Page Three');
//       const tabThreePageThreeBackButtonSelector = 'page-nine ion-button.back.hydrated';
//       const tabThreePageThreeBackButton = await getElement(driver, tabThreePageThreeBackButtonSelector);
//       tabThreePageThreeBackButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Three Page Two');

//       console.log('Switching to Tab Two');
//       tabTwoButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Two Page Three');
//       const tabTwoPageThreeBackButtonSelector = 'page-six ion-button.back.hydrated';
//       const tabTwoPageThreeBackButton = await getElement(driver, tabTwoPageThreeBackButtonSelector);
//       tabTwoPageThreeBackButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Two Page Two');
//       const tabTwoPageTwoBackButtonSelector = 'page-five ion-button.back.hydrated';
//       const tabTwoPageTwoBackButton = await getElement(driver, tabTwoPageTwoBackButtonSelector);
//       tabTwoPageTwoBackButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Two Page One');

//       console.log('Switching to Tab One');
//       tabOneButton.click();
//       await waitForTransition(600);

//       console.log('On Tab One Page Two');
//       const tabOnePageTwoBackButtonSelector = 'page-two ion-button.back.hydrated';
//       const tabOnePageTwoBackButton = await getElement(driver, tabOnePageTwoBackButtonSelector);
//       tabOnePageTwoBackButton.click();

//       await waitForTransition(600);

//       console.log('On Tab One Page One');

//       console.log('Switching to Tab Three');
//       tabThreeButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Three Page Two');
//       const tabThreePageTwoBackButtonSelector = 'page-eight ion-button.back.hydrated';
//       const tabThreePageTwoBackButton = await getElement(driver, tabThreePageTwoBackButtonSelector);
//       tabThreePageTwoBackButton.click();
//       await waitForTransition(600);

//       console.log('On Tab Three Page One');
//     });
//   });
// });
