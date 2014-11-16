describe('Ionic Body Class Service', function() {
  var ionicBody, doc;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicBody, $document) {
    ionicBody = $ionicBody;
    body = $document[0].body;
  }));

  it('Should add/remove one class the body tag', function() {
    ionicBody.addClass('class1');
    expect(body.classList.contains('class1')).toEqual(true);
    ionicBody.removeClass('class1');
    expect(body.classList.contains('class1')).toEqual(false);
  });

  it('Should add/remove multiple classes the body tag', function() {
    ionicBody.addClass('class1', 'class2', 'class3');
    expect(body.classList.contains('class1')).toEqual(true);
    expect(body.classList.contains('class2')).toEqual(true);
    expect(body.classList.contains('class3')).toEqual(true);
    ionicBody.removeClass('class1', 'class2', 'class3');
    expect(body.classList.contains('class1')).toEqual(false);
    expect(body.classList.contains('class2')).toEqual(false);
    expect(body.classList.contains('class3')).toEqual(false);
  });

  it('Should add/remove classes by chaining methods', function() {
    ionicBody.addClass('class1').addClass('class2').addClass('class3');
    expect(body.classList.contains('class1')).toEqual(true);
    expect(body.classList.contains('class2')).toEqual(true);
    expect(body.classList.contains('class3')).toEqual(true);
    ionicBody.removeClass('class1').removeClass('class2').removeClass('class3');
    expect(body.classList.contains('class1')).toEqual(false);
    expect(body.classList.contains('class2')).toEqual(false);
    expect(body.classList.contains('class3')).toEqual(false);
  });

  it('Should add/false one class using addTo and boolean first arg', function() {
    ionicBody.enableClass(true, 'class1');
    expect(body.classList.contains('class1')).toEqual(true);
    ionicBody.enableClass(false, 'class1');
    expect(body.classList.contains('class1')).toEqual(false);
  });

  it('Should add/false multiple classes using addTo and boolean first arg', function() {
    ionicBody.enableClass(true, 'class1', 'class2', 'class3');
    expect(body.classList.contains('class1')).toEqual(true);
    expect(body.classList.contains('class2')).toEqual(true);
    expect(body.classList.contains('class3')).toEqual(true);
    ionicBody.enableClass(false, 'class1', 'class2', 'class3');
    expect(body.classList.contains('class1')).toEqual(false);
    expect(body.classList.contains('class2')).toEqual(false);
    expect(body.classList.contains('class3')).toEqual(false);
  });

  it('Should append a jqLite element to the body', function() {
    var jqLiteElement = angular.element('<div>jqLite</div>');
    ionicBody.append(jqLiteElement);
    expect(body.lastChild.outerHTML).toEqual('<div>jqLite</div>');
  });

  it('Should append a DOM element to the body', function() {
    var domElement = document.createElement('span');
    domElement.innerText = 'domElement'
    ionicBody.append(domElement);
    expect(body.lastChild.outerHTML).toEqual('<span>domElement</span>');
  });

});
