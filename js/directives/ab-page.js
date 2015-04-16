/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .directive('abPage', [
    '$compile',
    function($compile) {
      return {
        restrict: 'E',
        scope: {
          'page': '=page',
          'gridOpts': '=gridOpts'
        },
        link: function(scope, element) {

          function createGrid(page) {

            var tpl = $compile(
              '<div gridster="gridsterOpts">' +
                '<ul>' +
                  '<li gridster-item="widget.tile" ng-repeat="widget in page">' +
                    '<ab-widget-container widget-title="widget.title" widget-type="widget.type" widget-data="widget.data"></ab-widget>' +
                  '</li>' +
                '</ul>' +
              '</div>'
            );

            var gridScope = scope.$new(true);

            gridScope.gridsterOpts = scope.gridOpts;
            gridScope.page = page;

            return tpl(gridScope);

          }

          var grid = createGrid(scope.page);
          element.append(grid);

        }
      };
    }
  ])
;
