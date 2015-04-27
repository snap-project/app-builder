/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('WorkspaceCtrl', [
    '$scope', '$timeout', 'WidgetsRegistry', 'AppHelpers',
    function($scope, $timeout, WidgetsRegistry, AppHelpers) {

      $scope.gridOpts = {
        draggable: {
          enabled: true
        },
        columns: 12,
        minColumns: 2,
        defaultSizeX: 2,
        defaultSizeY: 2,
      };

      $scope.currentApp = AppHelpers.getCurrentApp();
      $scope.currentPage = null;

      $scope.$watch('currentApp.pages', function(pages) {

        if(!pages) return;

        var pagesIds = Object.keys(pages);

        if(pagesIds.length === 0) {
          pages['page-1'] = [];
          $scope.currentPage = 'page-1';
        } else {
          $scope.currentPage = pagesIds[0];
        }

      });

      $scope.$on('abDrop', function(evt, data) {

        var widget = WidgetsRegistry.createWidgetForTag(data.model.tag);

        $timeout(function() {
          $scope.currentApp.pages[$scope.currentPage].push(widget);
        });

      });

    }
  ])
;
