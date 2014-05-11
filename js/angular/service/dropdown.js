/**
 * @ngdoc service
 * @name $ionicDropdown
 * @module ionic
 * @description
 * The Dropdown is a content pane that can go over the user's main view
 * temporarily.  Usually used for making a choice or editing an item.
 *
 * @usage
 * ```html
 * <script id="my-dropdown.html" type="text/ng-template">
 *   <div class="dropdown">
 *     <ion-header-bar>
 *       <h1 class="title">My Dropdown title</h1>
 *     </ion-header-bar>
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </div>
 * </script>
 * ```
 * ```js
 * angular.module('testApp', ['ionic'])
 * .controller('MyController', function($scope, $ionicDropdown) {
 *   $ionicDropdown.fromTemplateUrl('dropdown.html', {
 *     scope: $scope,
 *     animation: 'slide-in-up'
 *   }).then(function(dropdown) {
 *     $scope.dropdown = dropdown;
 *   });
 *   $scope.openDropdown = function() {
 *     $scope.dropdown.show();
 *   };
 *   $scope.closeDropdown = function() {
 *     $scope.dropdown.hide();
 *   };
 *   //Cleanup the dropdown when we're done with it!
 *   $scope.$on('$destroy', function() {
 *     $scope.dropdown.remove();
 *   });
 *   // Execute action on hide dropdown
 *   $scope.$on('dropdown.hide', function() {
 *     // Execute action
 *   });
 *   // Execute action on remove dropdown
 *   $scope.$on('dropdown.removed', function() {
 *     // Execute action
 *   });
 * });
 * ```
 */
IonicModule
  .factory('$ionicDropdown', [
    '$rootScope',
    '$document',
    '$compile',
    '$timeout',
    '$ionicPlatform',
    '$ionicTemplateLoader',
    '$q',
    function ($rootScope, $document, $compile, $timeout, $ionicPlatform, $ionicTemplateLoader, $q) {

      /**
       * @ngdoc controller
       * @name ionicDropdown
       * @module ionic
       * @description
       * Instantiated by the {@link ionic.service:$ionicDropdown} service.
       *
       * Hint: Be sure to call [remove()](#remove) when you are done with each dropdown
       * to clean it up and avoid memory leaks.
       *
       * Note: a dropdown will broadcast 'dropdown.shown' and 'dropdown.hidden' events from its originating
       * scope, passing in itself as an event argument.
       */
      var DropdownView = ionic.views.Dropdown.inherit({
        /**
         * @ngdoc method
         * @name ionicDropdown#initialize
         * @description Creates a new dropdown controller instance.
         * @param {object} options An options object with the following properties:
         *  - `{object=}` `scope` The scope to be a child of.
         *    Default: creates a child of $rootScope.
         *  - `{string=}` `animation` The animation to show & hide with.
         *    Default: 'slide-in-up'
         *  - `{boolean=}` `focusFirstInput` Whether to autofocus the first input of
         *    the dropdown when shown.  Default: false.
         */
        initialize: function (opts) {
          ionic.views.Dropdown.prototype.initialize.call(this, opts);
          this.animation = opts.animation || 'scale-down-up';
        },

        /**
         * @ngdoc method
         * @name ionicDropdown#show
         * @description Show this dropdown instance.
         * @returns {promise} A promise which is resolved when the dropdown is finished animating in.
         */
        show: function (target) {
          var self = this;
          var dropdownEl = jqLite(self.dropdownEl),
            targetRect = target
              ? target.getBoundingClientRect()
              : {
                 top: 0,
                 left: 0,
                 height: 0,
                 width: 0
               },
            icon = dropdownEl[0].querySelector('.arrow'),
            popupX,
            iconX,
            padding = 5;
          dropdownEl[0].style.top = targetRect.top + targetRect.height + 20 + 'px';

          setTimeout(function () {
            var style = window.getComputedStyle(dropdownEl[0]),
              width = parseInt(style.getPropertyValue('width').replace('px', '')),
              popupCenter = width>>1,
              targetCenter = targetRect.width >> 1,
              iconCenter = 14;

            if (targetRect.left > window.innerWidth >> 1) {
              var right = window.innerWidth - targetRect.right;
              popupX = right + targetCenter;
              if (popupX - popupCenter > padding) {
                // popup fits
                popupX -= popupCenter;
                // offset icon
                iconX = popupCenter - iconCenter - 1;
                //console.log(iconX)
              } else {
                // popup doesnt fit
                popupX = padding;
                // offset icon
                iconX = right + targetCenter - iconCenter - padding;
              }
              dropdownEl[0].style.left = 'initial';
              dropdownEl[0].style.right = popupX + 'px';
              icon.style.left = 'initial';
              icon.style.right = iconX + 'px';
            } else {
              popupX = targetRect.left + targetCenter;
              if (popupX - popupCenter > padding) {
                // popup fits
                popupX -= popupCenter;
                // offset icon
                iconX = popupCenter - iconCenter - 1;
              } else {
                // popup doesnt fit
                popupX = padding;
                // offset icon
                iconX = targetRect.left + targetCenter - iconCenter - padding;
              }
              dropdownEl[0].style.right = 'initial';
              dropdownEl[0].style.left = popupX + 'px';
              icon.style.right = 'initial';
              icon.style.left = iconX + 'px';
            }

            $timeout(function () {
              $document[0].body.classList.add('dropdown-open');
            }, 400);

            dropdownEl.addClass('ng-enter active')
              .removeClass('ng-leave ng-leave-active');
          })

          self.el.classList.remove('hide');
          if (!self.el.parentElement) {
            dropdownEl.addClass(self.animation);
            $document[0].body.appendChild(self.el);
          }
          self._isShown = true;
          self._deregisterBackButton = $ionicPlatform.registerBackButtonAction(function () {
            self.hide();
          }, 200);
          self._isOpenPromise = $q.defer();

          ionic.views.Dropdown.prototype.show.call(self);

          $timeout(function () {
            dropdownEl.addClass('ng-enter-active');
            self.scope.$parent && self.scope.$parent.$broadcast('dropdown.shown', self);
            self.el.classList.add('active');
          }, 1);

          return $timeout(function () {
            //After animating in, allow hide on backdrop click
            self.$el.on('click', function (e) {
              if (e.target === self.el) {
                self.hide();
              }
            });
          }, 400);
        },
        /**
         * @ngdoc method
         * @name ionicDropdown#hide
         * @description Hide this dropdown instance.
         * @returns {promise} A promise which is resolved when the dropdown is finished animating out.
         */
        hide: function () {
          var self = this;
          var dropdownEl = jqLite(self.dropdownEl);

          self.el.classList.remove('active');
          dropdownEl.addClass('ng-leave');

          $timeout(function () {
            dropdownEl.addClass('ng-leave-active')
              .removeClass('ng-enter ng-enter-active active');
          }, 20);

          self.$el.off('click');
          self._isShown = false;
          self.scope.$parent && self.scope.$parent.$broadcast('dropdown.hidden', self);
          self._deregisterBackButton && self._deregisterBackButton();

          ionic.views.Dropdown.prototype.hide.call(self);

          return $timeout(function () {
            $document[0].body.classList.remove('dropdown-open');
            self.el.classList.add('hide');
          }, 150);
        },
        /**
         * @ngdoc method
         * @name ionicDropdown#toggle
         * @description Toggle this dropdown instance from the DOM
         * @returns {promise} A promise which is resolved when the dropdown is finished animating in or out.
         */
        toggle: function(target) {
          if (this._isShown)
            return this.hide()
          else
            return this.show(target)
        },
        /**
         * @ngdoc method
         * @name ionicDropdown#remove
         * @description Remove this dropdown instance from the DOM and clean up.
         * @returns {promise} A promise which is resolved when the dropdown is finished animating out.
         */
        remove: function () {
          var self = this;
          self.scope.$parent && self.scope.$parent.$broadcast('dropdown.removed', self);

          return self.hide().then(function () {
            self.scope.$destroy();
            self.$el.remove();
          });
        },

        /**
         * @ngdoc method
         * @name ionicDropdown#isShown
         * @returns boolean Whether this dropdown is currently shown.
         */
        isShown: function () {
          return !!this._isShown;
        }
      });

      var createDropdown = function (templateString, options) {
        // Create a new scope for the dropdown
        var scope = options.scope && options.scope.$new() || $rootScope.$new(true);

        extend(scope, {
          $hasHeader: false,
          $hasSubheader: false,
          $hasFooter: false,
          $hasSubfooter: false,
          $hasTabs: false,
          $hasTabsTop: false
        });

        // Compile the template
        var element = $compile('<ion-dropdown>' + templateString + '</ion-dropdown>')(scope);

        options.$el = element;
        options.el = element[0];
        options.dropdownEl = options.el.querySelector('.dropdown');
        var dropdown = new DropdownView(options);

        dropdown.scope = scope;

        // If this wasn't a defined scope, we can assign 'dropdown' to the isolated scope
        // we created
        if (!options.scope) {
          scope.dropdown = dropdown;
        }

        return dropdown;
      };

      return {
        /**
         * @ngdoc method
         * @name $ionicDropdown#fromTemplate
         * @param {string} templateString The template string to use as the dropdown's
         * content.
         * @param {object} options Options to be passed {@link ionic.controller:ionicDropdown#initialize ionicDropdown#initialize} method.
         * @returns {object} An instance of an {@link ionic.controller:ionicDropdown}
         * controller.
         */
        fromTemplate: function (templateString, options) {
          var dropdown = createDropdown(templateString, options || {});
          return dropdown;
        },
        /**
         * @ngdoc method
         * @name $ionicDropdown#fromTemplateUrl
         * @param {string} templateUrl The url to load the template from.
         * @param {object} options Options to be passed {@link ionic.controller:ionicDropdown#initialize ionicDropdown#initialize} method.
         * options object.
         * @returns {promise} A promise that will be resolved with an instance of
         * an {@link ionic.controller:ionicDropdown} controller.
         */
        fromTemplateUrl: function (url, options, _) {
          var cb;
          //Deprecated: allow a callback as second parameter. Now we return a promise.
          if (angular.isFunction(options)) {
            cb = options;
            options = _;
          }
          return $ionicTemplateLoader.load(url).then(function (templateString) {
            var dropdown = createDropdown(templateString, options || {});
            cb && cb(dropdown);
            return dropdown;
          });
        }
      };
    }]);
