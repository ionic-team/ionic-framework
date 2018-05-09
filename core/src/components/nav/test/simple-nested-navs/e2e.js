// 'use strict';

// const expect = require('chai').expect;
// const { register, Page, platforms } = require('../../../../../scripts/e2e');
// const { getElement, waitForTransition } = require('../../../../../scripts/e2e/utils');

// class E2ETestPage extends Page {
//   constructor(driver, platform) {
//     super(driver, `http://localhost:3333/src/components/nav/test/simple-nested-navs?ionic:mode=${platform}`);
//   }
// }

// platforms.forEach(platform => {
//   describe('nav/simple-nested-navs', () => {
//     register('should init', driver => {
//       const page = new E2ETestPage(driver, platform);
//       return page.navigate();
//     });

//     register('should go from nav-one-page-one, nav-one-page-two, nav-two-page-one, nav-one-page-three, nav-one-page-two, nav-one-page-one', async (driver, testContext) => {

//       testContext.timeout(60000);
//       const page = new E2ETestPage(driver, platform);

//       await waitForTransition(300);

//       console.log('On Nav One Page One');
//       const navOnePageOneNextButtonSelector = '.nav-one-page-one ion-button.next.hydrated';
//       const navOnePageOneNextButton = await getElement(driver, navOnePageOneNextButtonSelector);
//       navOnePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoNextButtonSelector = '.nav-one-page-two ion-button.next.hydrated';
//       const navOnePageTwoNextButton = await getElement(driver, navOnePageTwoNextButtonSelector);
//       navOnePageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page One');
//       const navTwoPageOneNextButtonSelector = '.nav-two-page-one ion-button.next.nav-one.hydrated';
//       const navTwoPageOneNextButton = await getElement(driver, navTwoPageOneNextButtonSelector);
//       navTwoPageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Three');
//       const navOnePageThreePreviousButtonSelector = '.nav-one-page-three ion-button.previous.hydrated';
//       const navOnePageThreePreviousButton = await getElement(driver, navOnePageThreePreviousButtonSelector);
//       navOnePageThreePreviousButton.click();
//       await waitForTransition(600);


//       console.log('On Nav Two Page One');
//       const navTwoPageOnePreviousButtonSelector = '.nav-two-page-one ion-button.previous.nav-one.hydrated';
//       const navTwoPageOnePreviousButton = await getElement(driver, navTwoPageOnePreviousButtonSelector);
//       navTwoPageOnePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoPreviousButtonSelector = '.nav-one-page-two ion-button.previous.hydrated';
//       const navOnePageTwoPreviousButton = await getElement(driver, navOnePageTwoPreviousButtonSelector);
//       navOnePageTwoPreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page One');
//       const navOnePageOneSelector = '.nav-one-page-one';
//       const navOnePageOne = await getElement(driver, navOnePageOneSelector);
//     });


//     register('should go from nav-one-page-one, nav-one-page-two, nav-two-page-one, nav-two-page-two, nav-three-page-one, nav two-page-three and so on', async (driver, testContext) => {

//       testContext.timeout(60000);
//       const page = new E2ETestPage(driver, platform);

//       await waitForTransition(300);

//       console.log('On Nav One Page One');
//       const navOnePageOneNextButtonSelector = '.nav-one-page-one ion-button.next.hydrated';
//       const navOnePageOneNextButton = await getElement(driver, navOnePageOneNextButtonSelector);
//       navOnePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoNextButtonSelector = '.nav-one-page-two ion-button.next.hydrated';
//       const navOnePageTwoNextButton = await getElement(driver, navOnePageTwoNextButtonSelector);
//       navOnePageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page One');
//       const navTwoPageOneNextButtonSelector = '.nav-two-page-one ion-button.next.nav-two.hydrated';
//       const navTwoPageOneNextButton = await getElement(driver, navTwoPageOneNextButtonSelector);
//       navTwoPageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page Two');
//       const navTwoPageTwoNextButtonSelector = '.nav-two-page-two ion-button.next.hydrated';
//       const navTwoPageTwoNextButton = await getElement(driver, navTwoPageTwoNextButtonSelector);
//       navTwoPageTwoNextButton.click();
//       await waitForTransition(600);


//       console.log('On Nav Three Page One');
//       const navThreePageOneNextButtonSelector = '.nav-three-page-one ion-button.next.nav-two.hydrated';
//       const navThreePageOneNextButton = await getElement(driver, navThreePageOneNextButtonSelector);
//       navThreePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page Three');
//       const navTwoPageThreePreviousButtonSelector = '.nav-two-page-three ion-button.previous.hydrated';
//       const navTwoPageThreePreviousButton = await getElement(driver, navTwoPageThreePreviousButtonSelector);
//       navTwoPageThreePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Three Page One');
//       const navThreePageOnePreviousButtonSelector = '.nav-three-page-one ion-button.previous.nav-two.hydrated';
//       const navThreePageOnePreviousButton = await getElement(driver, navThreePageOnePreviousButtonSelector);
//       navThreePageOnePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page Two');
//       const navTwoPageTwoPreviousButtonSelector = '.nav-two-page-two ion-button.previous.hydrated';
//       const navTwoPageTwoPreviousButton = await getElement(driver, navTwoPageTwoPreviousButtonSelector);
//       navTwoPageTwoPreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page One');
//       const navTwoPageOnePreviousButtonSelector = '.nav-two-page-one ion-button.previous.nav-one.hydrated';
//       const navTwoPageOnePreviousButton = await getElement(driver, navTwoPageOnePreviousButtonSelector);
//       navTwoPageOnePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoPreviousButtonSelector = '.nav-one-page-two ion-button.previous.hydrated';
//       const navOnePageTwoPreviousButton = await getElement(driver, navOnePageTwoPreviousButtonSelector);
//       navOnePageTwoPreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page One');
//       const navOnePageOneSelector = '.nav-one-page-one';
//       const navOnePageOne = await getElement(driver, navOnePageOneSelector);

//     });

//     register('should go from nav-one-page-one, nav-one-page-two, nav-two-page-one, nav-two-page-two, nav-three-page-one, nav-one-page-two, nav-one-page-one', async (driver, testContext) => {

//       testContext.timeout(60000);
//       const page = new E2ETestPage(driver, platform);

//       await waitForTransition(300);

//       console.log('On Nav One Page One');
//       const navOnePageOneNextButtonSelector = '.nav-one-page-one ion-button.next.hydrated';
//       const navOnePageOneNextButton = await getElement(driver, navOnePageOneNextButtonSelector);
//       navOnePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoNextButtonSelector = '.nav-one-page-two ion-button.next.hydrated';
//       const navOnePageTwoNextButton = await getElement(driver, navOnePageTwoNextButtonSelector);
//       navOnePageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page One');
//       const navTwoPageOneNextButtonSelector = '.nav-two-page-one ion-button.next.nav-two.hydrated';
//       const navTwoPageOneNextButton = await getElement(driver, navTwoPageOneNextButtonSelector);
//       navTwoPageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page Two');
//       const navTwoPageTwoNextButtonSelector = '.nav-two-page-two ion-button.next.hydrated';
//       const navTwoPageTwoNextButton = await getElement(driver, navTwoPageTwoNextButtonSelector);
//       navTwoPageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Three Page One');
//       const navThreePageOnePreviousButtonSelector = '.nav-three-page-one ion-button.previous.nav-one.hydrated';
//       const navThreePageOnePreviousButton = await getElement(driver, navThreePageOnePreviousButtonSelector);
//       navThreePageOnePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoPreviousButtonSelector = '.nav-one-page-two ion-button.previous.hydrated';
//       const navOnePageTwoPreviousButton = await getElement(driver, navOnePageTwoPreviousButtonSelector);
//       navOnePageTwoPreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page One');
//       const navOnePageOneSelector = '.nav-one-page-one';
//       const navOnePageOne = await getElement(driver, navOnePageOneSelector);
//     });

//     register('should go from nav-one-page-one, nav-one-page-two, nav-two-page-one, nav-two-page-two, nav-three-page-one, nav-three-page-two, nav-three-page-three, nav-three-page-two, nav-three-page-one, nav-two-page-two, nav-two-page-one, nav-one-page-two, nav-one-page-one', async (driver, testContext) => {

//       testContext.timeout(60000);
//       const page = new E2ETestPage(driver, platform);

//       await waitForTransition(300);

//       console.log('On Nav One Page One');
//       const navOnePageOneNextButtonSelector = '.nav-one-page-one ion-button.next.hydrated';
//       const navOnePageOneNextButton = await getElement(driver, navOnePageOneNextButtonSelector);
//       navOnePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoNextButtonSelector = '.nav-one-page-two ion-button.next.hydrated';
//       const navOnePageTwoNextButton = await getElement(driver, navOnePageTwoNextButtonSelector);
//       navOnePageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page One');
//       const navTwoPageOneNextButtonSelector = '.nav-two-page-one ion-button.next.nav-two.hydrated';
//       const navTwoPageOneNextButton = await getElement(driver, navTwoPageOneNextButtonSelector);
//       navTwoPageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page Two');
//       const navTwoPageTwoNextButtonSelector = '.nav-two-page-two ion-button.next.hydrated';
//       const navTwoPageTwoNextButton = await getElement(driver, navTwoPageTwoNextButtonSelector);
//       navTwoPageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Three Page One');
//       const navThreePageOneNextButtonSelector = '.nav-three-page-one ion-button.next.nav-three.hydrated';
//       const navThreePageOneNextButton = await getElement(driver, navThreePageOneNextButtonSelector);
//       navThreePageOneNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Three Page Two');
//       const navThreePageTwoNextButtonSelector = '.nav-three-page-two ion-button.next.hydrated';
//       const navThreePageTwoNextButton = await getElement(driver, navThreePageTwoNextButtonSelector);
//       navThreePageTwoNextButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Three Page Three');
//       const navThreePageThreePreviousButtonSelector = '.nav-three-page-three ion-button.previous.hydrated';
//       const navThreePageThreePreviousButton = await getElement(driver, navThreePageThreePreviousButtonSelector);
//       navThreePageThreePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Three Page Two');
//       const navThreePageTwoPreviousButtonSelector = '.nav-three-page-two ion-button.previous.hydrated';
//       const navThreePageTwoPreviousButton = await getElement(driver, navThreePageTwoPreviousButtonSelector);
//       navThreePageTwoPreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Three Page One');
//       const navThreePageOnePreviousButtonSelector = '.nav-three-page-one ion-button.nav-two.previous.hydrated';
//       const navThreePageOnePreviousButton = await getElement(driver, navThreePageOnePreviousButtonSelector);
//       navThreePageOnePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page Two');
//       const navTwoPageTwoPreviousButtonSelector = '.nav-two-page-two ion-button.previous.hydrated';
//       const navTwoPageTwoPreviousButton = await getElement(driver, navTwoPageTwoPreviousButtonSelector);
//       navTwoPageTwoPreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav Two Page One');
//       const navTwoPageOnePreviousButtonSelector = '.nav-two-page-one ion-button.previous.nav-one.hydrated';
//       const navTwoPageOnePreviousButton = await getElement(driver, navTwoPageOnePreviousButtonSelector);
//       navTwoPageOnePreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page Two');
//       const navOnePageTwoPreviousButtonSelector = '.nav-one-page-two ion-button.previous.hydrated';
//       const navOnePageTwoPreviousButton = await getElement(driver, navOnePageTwoPreviousButtonSelector);
//       navOnePageTwoPreviousButton.click();
//       await waitForTransition(600);

//       console.log('On Nav One Page One');
//       const navOnePageTwoSelector = '.nav-one-page-one';
//       const navOnePageTwo = await getElement(driver, navOnePageTwoSelector);
//     });
//   });
// });
