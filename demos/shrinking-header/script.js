angular.module('ionicApp', ['ionic'])

.directive('fakeStatusbar', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="fake-statusbar"><div class="pull-left">Carrier</div><div class="time">3:30 PM</div><div class="pull-right">50%</div></div>'
  };
})

.directive('headerShrink', function ($document) {
  var fadeAmt;

  var shrink = function (header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function () {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for (var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function ($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;

      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;

      $element.bind('scroll', function (e) {
        if (e.detail.scrollTop > starty) {
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - e.detail.scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  };
});