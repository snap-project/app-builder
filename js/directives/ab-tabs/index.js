/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .directive('abTabsContainer', function() {
    return {
      restrict: 'E',
      transclude: true,
      template: require('./templates/tabs.html!text'),
      scope: {},
      link: function(scope, element, attrs) {
        scope.tabs = [];
        angular.forEach(element.find('ab-tab'), function(abTab) {
          abTab = angular.element(abTab);
          scope.tabs.push({
            label: abTab.attr('label'),
            content: abTab.contents()
          })
          abTab.remove();
        });
      },
      controller: function($scope) {

        $scope.selectedTab = null;

        $scope.showTab = function(tab) {
          $scope.selectedTab = tab;
        }

        $scope.$watch('tabs', function(tabs) {
          if(tabs && !$scope.selectedTab) {
            $scope.selectedTab = tabs[0];
          }
        });

      }
    };
  })
  .directive('abTab', function($compile) {
    return {
      restrict: 'E',
      require: '^abTabsContainer'
    };
  })
;
