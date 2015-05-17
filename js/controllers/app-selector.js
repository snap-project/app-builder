/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('AppSelectorCtrl', [
    '$scope', 'Apps', '$location',
    function($scope, Apps, $location) {

      $scope.apps = [];

      Apps.fetchList()
        .then(function(apps) {
          $scope.apps = apps;
        })
      ;

      $scope.selectedApp = null;
      $scope.newAppName = null;

      $scope.selectApp = function(app) {
        $scope.selectedApp = app;
      };

      $scope.isAppSelected = function(app) {
        return $scope.selectedApp === app;
      };

      $scope.hasAppSelected = function() {
        return $scope.selectedApp &&
          ($scope.selectedApp !== 'new' || $scope.newAppName)
        ;
      };

      $scope.openSelectedApp = function() {

        var app = $scope.selectedApp;

        if(app === 'new') {
          app = Apps.newApp($scope.newAppName);
        }

        Apps.setCurrentApp(app);

        // Load workspace
        $location.path('/workspace');

      };

    }
  ])
;
