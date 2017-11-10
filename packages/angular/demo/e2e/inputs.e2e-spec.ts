import { InputsPage } from './inputs.po';

describe('Demo Inputs Page', () => {
  let page: InputsPage;

  beforeEach(() => {
    page = new InputsPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitle()).toEqual('Ionic Core Inputs Demo');
  });
});
