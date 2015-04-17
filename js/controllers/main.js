/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('MainCtrl', [
    '$scope', 'AppHelpers',
    function($scope, AppHelpers) {

      $scope.appTitle = 'AppBuilder';

      $scope.saveApp = function() {
        AppHelpers.saveApp({});
      };

    }
  ])
;
