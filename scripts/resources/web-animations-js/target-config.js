// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

(function() {

  var scopeSrc = [
      'src/scope.js'];

  var webAnimations1Src = [
      'src/keyframe-interpolations.js',
      'src/property-interpolation.js',
      'src/keyframe-effect.js',
      'src/apply-preserving-inline-style.js',
      'src/element-animatable.js',
      'src/interpolation.js',
      'src/matrix-interpolation.js',
      'src/animation.js',
      'src/tick.js',
      'src/matrix-decomposition.js',
      'src/handler-utils.js',
      'src/shadow-handler.js',
      'src/number-handler.js',
      'src/visibility-handler.js',
      'src/color-handler.js',
      'src/dimension-handler.js',
      'src/box-handler.js',
      'src/transform-handler.js',
      'src/font-weight-handler.js',
      'src/position-handler.js',
      'src/shape-handler.js',
      'src/property-names.js',
  ];

  var liteWebAnimations1Src = [
      'src/keyframe-interpolations.js',
      'src/property-interpolation.js',
      'src/keyframe-effect.js',
      'src/apply.js',
      'src/element-animatable.js',
      'src/interpolation.js',
      'src/animation.js',
      'src/tick.js',
      'src/handler-utils.js',
      'src/shadow-handler.js',
      'src/number-handler.js',
      'src/visibility-handler.js',
      'src/color-handler.js',
      'src/dimension-handler.js',
      'src/box-handler.js',
      'src/transform-handler.js',
      'src/property-names.js',
  ];


  var sharedSrc = [
      'src/timing-utilities.js',
      'src/normalize-keyframes.js',
      //'src/deprecation.js',
  ];

  var webAnimationsNextSrc = [
      'src/timeline.js',
      'src/web-animations-next-animation.js',
      'src/keyframe-effect-constructor.js',
      'src/effect-callback.js',
      'src/group-constructors.js'];

  var webAnimations1Test = [
      'test/js/animation-finish-event.js',
      'test/js/animation.js',
      'test/js/apply-preserving-inline-style.js',
      'test/js/box-handler.js',
      'test/js/color-handler.js',
      'test/js/dimension-handler.js',
      'test/js/interpolation.js',
      'test/js/keyframes.js',
      'test/js/matrix-interpolation.js',
      'test/js/number-handler.js',
      'test/js/property-interpolation.js',
      'test/js/tick.js',
      'test/js/timing-utilities.js',
      'test/js/timing.js',
      'test/js/transform-handler.js'];

  var webAnimationsNextTest = webAnimations1Test.concat(
      'test/js/effect-callback.js',
      'test/js/group-animation-finish-event.js',
      'test/js/group-animation.js',
      'test/js/group-constructors.js',
      'test/js/keyframe-effect-constructor.js',
      'test/js/timeline.js',
      'test/js/web-animations-next-animation.js');

  // This object specifies the source and test files for different Web Animation build targets.
  var targetConfig = {
    'web-animations': {
      scopeSrc: scopeSrc,
      sharedSrc: sharedSrc,
      //webAnimations1Src: webAnimations1Src,
      webAnimations1Src: liteWebAnimations1Src,
      webAnimationsNextSrc: [],
      src: scopeSrc.concat(sharedSrc).concat(webAnimations1Src),
      test: webAnimations1Test,
    },
    'web-animations-next': {
      scopeSrc: scopeSrc,
      sharedSrc: sharedSrc,
      webAnimations1Src: webAnimations1Src,
      webAnimationsNextSrc: webAnimationsNextSrc,
      src: scopeSrc.concat(sharedSrc).concat(webAnimations1Src).concat(webAnimationsNextSrc),
      test: webAnimationsNextTest,
    },
    'web-animations-next-lite': {
      scopeSrc: scopeSrc,
      sharedSrc: sharedSrc,
      webAnimations1Src: liteWebAnimations1Src,
      webAnimationsNextSrc: webAnimationsNextSrc,
      src: scopeSrc.concat(sharedSrc).concat(liteWebAnimations1Src).concat(webAnimationsNextSrc),
      test: [],
    },
  };

  if (typeof module != 'undefined')
    module.exports = targetConfig;
  else
    window.webAnimationsTargetConfig = targetConfig;
})();
