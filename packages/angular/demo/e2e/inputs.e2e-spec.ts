import { InputsPage } from './inputs.po';

describe('Demo Inputs Page', () => {
  let page: InputsPage;

  beforeEach(() => {
    page = new InputsPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Ionic Core Inputs Demo');
  });

  describe('input one', () => {
    it('should display the starting text', () => {
      page.navigateTo();
      const el = page.getInputOne();
      expect(el.getAttribute('value')).toEqual('This is data for test input one');
    });
  });
});
