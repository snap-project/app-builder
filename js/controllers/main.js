/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('MainCtrl', [
    '$scope', 'Apps', '$location',
    function($scope, Apps, $location) {

      $scope.appTitle = 'AppBuilder';

      $scope.saveApp = function() {
        var currentApp = Apps.getCurrentApp();
        Apps.save(currentApp);
      };

      $scope.openApp = function() {
        $location.path('/select-app');
      };

    }
  ])
;
