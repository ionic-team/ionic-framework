import { browser, ElementFinder } from 'protractor/built';

import { ActionSheetPage } from './action-sheet.po';
import { sleep } from './utils/helpers';

describe('Action Sheet Page', () => {
  let page: ActionSheetPage;

  beforeEach(() => {
    page = new ActionSheetPage();
  });

  it('should open page', async (done) => {
    await page.navigateTo();
    done();
  });

  it('should open the action sheet, then close it using the close button', async (done) => {
    const button = await page.getButton();
    await sleep(100);
    await button.click();
    await sleep(500);
    let actionSheet = await page.getActionSheet();
    expect(await actionSheet.isPresent()).toBeTruthy();
    const closeButton = await page.getActionSheetCloseButton();
    await closeButton.click();
    await sleep(500);
    actionSheet = null;
    actionSheet = await page.getActionSheet();
    expect(await actionSheet.isPresent()).toBeFalsy();
    done();
  });

});
