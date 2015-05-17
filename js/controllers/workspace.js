/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('WorkspaceCtrl', [
    '$scope', '$timeout', 'WidgetsRegistry', 'Apps',
    function($scope, $timeout, WidgetsRegistry, Apps) {

      $scope.gridOpts = {
        draggable: {
          enabled: true
        },
        columns: 12,
        minColumns: 2,
        defaultSizeX: 2,
        defaultSizeY: 2,
      };

      $scope.currentApp = Apps.getCurrentApp();
      $scope.currentPage = 0;

      if($scope.currentApp.pages.length === 0) {
        $scope.currentApp.newPage();
      }

      $scope.$on('abDrop', function(evt, data) {

        var widget = WidgetsRegistry.createWidgetForTag(data.model.tag);

        $timeout(function() {
          $scope.currentApp.pages[$scope.currentPage].push(widget);
        });

      });

    }
  ])
;
