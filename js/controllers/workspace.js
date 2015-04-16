/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('WorkspaceController', [
    '$scope', 'WidgetsRegistry',
    function($scope, WidgetsRegistry) {

      $scope.widgets = WidgetsRegistry.getRegisteredWidgets();

      $scope.myPage = [
        { title: 'Test Widget', type: 'hello-world-widget', data: {}, tile: {row: 0, col: 1, sizeX: 1, sizeY: 2} },
        { title: 'Test Widget2', type: 'hello-world-widget', data: { user: 'bar' }, tile: {row: 0, col: 1, sizeX: 3, sizeY: 1} }
      ];

    }
  ])
;
