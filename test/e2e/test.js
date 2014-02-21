describe('tabs test page', function() {
  var P;
  beforeEach(function() {
    browser.get('http://localhost:8080/test/e2e/tabs-test.html');
    P = protractor.getInstance();
  });

  function navTitle() {
    return element(by.css('h1.title'));
  }
  function navButtons(dir) {
    return dir == 'back' ?
      element(by.css('header .back-button')) :
      element(by.css('header .'+dir+'-buttons .button'));
  }

  it('navbar with multiple histories', function() {
    browser.sleep(1000);
    expect(navTitle().getText()).toBe('Sign-In');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    expect(navButtons('left').getText()).toEqual('Home');
    expect(navButtons('left').getAttribute('class')).toContain('ion-home');
    expect(navButtons('right').getText()).toEqual('');
    expect(navButtons('right').getAttribute('class')).toContain('ion-navicon');


    element(by.id('sign-in-button')).click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    // expect(P.isElementPresent(navButtons('left'))).toBe(false);
    // expect(P.isElementPresent(navButtons('right'))).toBe(false);

    element(by.css('[href="#/tabs/autos/3"]')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');
    expect(navButtons('back').getText()).toEqual('Back');
    expect(element(by.css('.back-button i')).getAttribute('class')).toContain('ion-arrow-left-c');
    // expect(P.isElementPresent(navButtons('left'))).toBe(false);
    // expect(P.isElementPresent(navButtons('right'))).toBe(false);

    element(by.css('.tabs a.tab-item:nth-child(2)')).click();

    expect(navTitle().getText()).toBe('Add Auto');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    // expect(P.isElementPresent(navButtons('left'))).toBe(false);
    // expect(P.isElementPresent(navButtons('right'))).toBe(false);

    element(by.css('.tabs a:nth-child(1)')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');

    navButtons('back').click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');

    element(by.css('[href="#/tabs/autos/3"]')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');

    element(by.css('.tabs a:nth-child(1)')).click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');

    element(by.css('[href="#/tabs/autos/3"]')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');

    element(by.css('.tabs a:nth-child(4)')).click();

    expect(navTitle().getText()).toBe('Sign-In');
    expect(navButtons('back').getAttribute('class')).toContain('hide');

    element(by.id('sign-in-button')).click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
  });
});
