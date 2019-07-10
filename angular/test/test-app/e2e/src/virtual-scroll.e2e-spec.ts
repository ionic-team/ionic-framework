import { browser, element, by } from 'protractor';
import { waitTime, handleErrorMessages } from './utils';

describe('virtual-scroll', () => {
  afterEach(() => {
    return handleErrorMessages();
  });
  beforeEach(async () => {
    await browser.get('/virtual-scroll');
    await waitTime(30);
  });

  it('should open virtual-scroll', () => {
    const virtualElements = element.all(by.css('ion-virtual-scroll > *'));
    expect(virtualElements.count()).toBeGreaterThan(0);
  });

});
