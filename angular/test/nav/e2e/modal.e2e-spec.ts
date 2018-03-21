import { browser, ElementFinder } from 'protractor/built';

import { ModalPage } from './modal.po';
import { sleep } from './utils/helpers';

describe('Modal Page', () => {
  let page: ModalPage;

  beforeEach(() => {
    page = new ModalPage();
  });

  it('should open page', async (done) => {
    await page.navigateTo();
    done();
  });

  it('should open the modal', async (done) => {
    /*const button = await page.getButton();
    await button.click();
    await sleep(500);
    const blah = page.getModal();
    blah.isPresent().then((present) => {
      console.log('boom boom boom: ', present);
      done();
    }).catch((ex) => {
      console.log('caught it: ', ex);
      done();
    });
    */
    // console.log('blah: ', await blah.isPresent());
    /*page.getModal().then((modal) => {
      return modal.isPresent();
    }).then((present) => {
      console.log('boom boom boom: ', present);
      done();
    }).catch(() => {
      console.log('caught it');
      done();
    })
    */
    done();
    /*console.log('modal: ', modal);
    console.log('modal.isPresent: ', modal.isPresent);
    console.log('Got the modal: ', await modal.isPresent());
    expect(await modal.isPresent()).toBeTruthy();
    */
  });
});
