/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .directive('abPage', [
    '$compile', '$rootScope',
    function($compile, $rootScope) {
      return {
        restrict: 'E',
        template: require('./templates/ab-page.html!text'),
        scope: {
          'page': '=page',
          'gridsterOpts': '=gridOpts'
        },
        controller: function($scope) {

          $scope.dispatchWidgetFocus = function(widget) {
            $rootScope.$broadcast('abPageWidgetFocus', widget);
          };

        }
      };
    }
  ])
  .directive('abWidgetContainer', [
    '$compile',
    function($compile) {
      return {
        restrict: 'E',
        require: '^abPage',
        template: require('./templates/ab-widget-container.html!text'),
        scope: {
          'data': '=widgetData',
          'tag': '=widgetTag',
          'title': '=widgetTitle'
        },
        link: function(scope, element) {
          var tpl = $compile('<'+scope.tag+' widget-data="data"></'+scope.tag+'>');
          var el = tpl(scope);
          angular.element(element.find('div')[1]).append(el);
        }
      };
    }
  ])
;
