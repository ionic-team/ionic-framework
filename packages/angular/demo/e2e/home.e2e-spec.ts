import { HomePage } from './home.po';

describe('Demo Home Page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Ionic Core Angular Demo Application');
  });

  it('should navigate to home for root', () => {
    page.navigateToRoot();
    expect(page.getTitleText()).toEqual('Ionic Core Angular Demo Application');
  });
});
