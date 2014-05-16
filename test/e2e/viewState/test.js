describe('viewState', function() {
  beforeEach(function() {
    browser.get('http://localhost:8765/test/e2e/viewState/test.html');
  });

  function navTitle() {
    return element(by.css('h1.title'));
  }
  function navButtons(dir) {
    return dir == 'back' ?
      element(by.css('.bar-header .back-button')) :
      element(by.css('.bar-header .'+dir+'-buttons .button'));
  }

  it('navbar with multiple histories', function() {
    expect(navTitle().getText()).toBe('Sign-In');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    expect(navButtons('left').getText()).toEqual('Home');
    expect(navButtons('left').getAttribute('class')).toContain('ion-home');
    expect(navButtons('right').getText()).toEqual('');
    expect(navButtons('right').getAttribute('class')).toContain('ion-navicon');

    browser.takeScreenshot().then(function(png) {
      console.log(png);
    });


    element(by.id('sign-in-button')).click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    element(by.css('[href="#/tabs/autos/3"]')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');
    expect(navButtons('back').getText()).toEqual('Back');
    expect(element(by.css('.back-button i')).getAttribute('class')).toContain('ion-arrow-left-c');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    element(by.css('.tabs .tab-item:nth-of-type(2)')).click();

    expect(navTitle().getText()).toBe('Add Auto');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    element(by.css('.tabs .tab-item:nth-of-type(1)')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    navButtons('back').click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    element(by.css('[href="#/tabs/autos/3"]')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    element(by.css('.tabs a:nth-of-type(1)')).click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    element(by.css('[href="#/tabs/autos/3"]')).click();

    expect(navTitle().getText()).toBe('Auto Details');
    expect(navButtons('back').getAttribute('class')).not.toContain('hide');
    expect(navButtons('left').isPresent()).toBe(false);
    expect(navButtons('right').isPresent()).toBe(false);

    element(by.css('.tabs a:nth-of-type(4)')).click();

    expect(navTitle().getText()).toBe('Sign-In');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
    expect(navButtons('left').getText()).toEqual('Home');
    expect(navButtons('left').getAttribute('class')).toContain('ion-home');
    expect(navButtons('right').getText()).toEqual('');
    expect(navButtons('right').getAttribute('class')).toContain('ion-navicon');

    element(by.id('sign-in-button')).click();

    expect(navTitle().getText()).toBe('Auto List');
    expect(navButtons('back').getAttribute('class')).toContain('hide');
  });
});
