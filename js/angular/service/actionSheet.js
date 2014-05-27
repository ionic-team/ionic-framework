/**
 * @ngdoc service
 * @name $ionicActionSheet
 * @module ionic
 * @description
 * The Action Sheet is a slide-up pane that lets the user choose from a set of options.
 * Dangerous options are highlighted in red and made obvious.
 *
 * There are easy ways to cancel out of the action sheet, such as tapping the backdrop or even
 * hitting escape on the keyboard for desktop testing.
 *
 * ![Action Sheet](http://ionicframework.com.s3.amazonaws.com/docs/controllers/actionSheet.gif)
 *
 * @usage
 * To trigger an Action Sheet in your code, use the $ionicActionSheet service in your angular controllers:
 *
 * ```js
 * angular.module('mySuperApp', ['ionic'])
 * .controller(function($scope, $ionicActionSheet) {
 *
 *  // Triggered on a button click, or some other target
 *  $scope.show = function() {
 *
 *    // Show the action sheet
 *    $ionicActionSheet.show({
 *      buttons: [
 *        { text: '<b>Share</b> This' },
 *        { text: 'Move' },
 *      ],
 *      destructiveText: 'Delete',
 *      titleText: 'Modify your album',
 *      cancelText: 'Cancel',
 *      buttonClicked: function(index) {
 *        return true;
 *      }
 *    });
 *
 *  };
 * });
 * ```
 *
 */
IonicModule
.factory('$ionicActionSheet', [
  '$rootScope',
  '$document',
  '$compile',
  '$animate',
  '$timeout',
  '$ionicTemplateLoader',
  '$ionicPlatform',
function($rootScope, $document, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform) {

  return {
    /**
     * @ngdoc method
     * @name $ionicActionSheet#show
     * @description
     * Load and return a new action sheet.
     *
     * A new isolated scope will be created for the
     * action sheet and the new element will be appended into the body.
     *
     * @param {object} opts The options for this ActionSheet. Properties:
     *
     *  - `[Object]` `buttons` Which buttons to show.  Each button is an object with a `text` field.
     *  - `{string}` `titleText` The title to show on the action sheet.
     *  - `{string=}` `cancelText` The text for a 'cancel' button on the action sheet.
     *  - `{string=}` `destructiveText` The text for a 'danger' on the action sheet.
     *  - `{function=}` `cancel` Called if the cancel button is pressed or the backdrop is tapped.
     *  - `{function=}` `buttonClicked` Called when one of the non-destructive buttons is clicked,
     *     with the index of the button that was clicked and the button object. Return true to close
     *     the action sheet, or false to keep it opened.
     *  - `{function=}` `destructiveButtonClicked` Called when the destructive button is clicked.
     *     Return true to close the action sheet, or false to keep it opened.
     */
    show: function(opts) {
      var scope = $rootScope.$new(true);

      extend(scope, {
        cancel: angular.noop,
        buttonClicked: angular.noop,
        destructiveButtonClicked: angular.noop,
        buttons: []
      }, opts);

      // Compile the template
      var element = $compile('<ion-action-sheet buttons="buttons"></ion-action-sheet>')(scope);

      // Grab the sheet element for animation
      var sheetEl = jqLite(element[0].querySelector('.action-sheet-wrapper'));

      var hideSheet = function(didCancel) {
        sheetEl.removeClass('action-sheet-up');
        if(didCancel) {
          $timeout(function(){
            opts.cancel();
          }, 200);
        }

        $animate.removeClass(element, 'active', function() {
          scope.$destroy();
        });

        $document[0].body.classList.remove('action-sheet-open');

        scope.$deregisterBackButton && scope.$deregisterBackButton();
      };

      // Support Android back button to close
      scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
        function(){
          hideSheet();
        },
        PLATFORM_BACK_BUTTON_PRIORITY_ACTION_SHEET
      );

      scope.cancel = function() {
        hideSheet(true);
      };

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index, opts.buttons[index])) === true) {
          hideSheet(false);
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          hideSheet(false);
        }
      };

      $document[0].body.appendChild(element[0]);

      $document[0].body.classList.add('action-sheet-open');

      var sheet = new ionic.views.ActionSheet({el: element[0] });
      scope.sheet = sheet;

      $animate.addClass(element, 'active');

      $timeout(function(){
        sheetEl.addClass('action-sheet-up');
      }, 20);

      return sheet;
    }
  };

}]);
