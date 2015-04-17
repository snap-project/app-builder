/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('WorkspaceCtrl', [
    '$scope', '$timeout', 'WidgetsRegistry',
    function($scope, $timeout, WidgetsRegistry) {

      $scope.gridOpts = {
        draggable: {
          enabled: true,
          handle: '.panel-heading'
        }
      };

      $scope.currentPage = [
        { title: 'Test Widget', type: 'hello-world-widget', data: {}, tile: {row: 0, col: 0, sizeX: 1, sizeY: 2} },
        { title: 'Test Widget2', type: 'hello-world-widget', data: { world: 'bar' }, tile: {row: 0, col: 1, sizeX: 3, sizeY: 1} }
      ];

      $scope.$on('abDrop', function(evt, data) {

        var widget = WidgetsRegistry.createWidgetForTag(data.model.tag);

        $timeout(function() {
          $scope.currentPage.push(widget);
        });

      });

    }
  ])
;
