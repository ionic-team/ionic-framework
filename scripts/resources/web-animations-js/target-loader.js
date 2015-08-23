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
  var target = webAnimationsTargetConfig.defaultTarget;
  if (typeof webAnimationsSourceTarget != 'undefined')
    target = webAnimationsSourceTarget;

  // Native implementation detection.

  var scripts = document.getElementsByTagName('script');
  var location = scripts[scripts.length - 1].src.replace(/[^\/]+$/, '');
  webAnimationsTargetConfig[target].src.forEach(function(sourceFile) {
    document.write('<script src="' + location + sourceFile + '"></script>');
  });
})();
