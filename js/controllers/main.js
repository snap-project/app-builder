/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('MainCtrl', [
    '$scope',
    function($scope) {
      $scope.appTitle = 'AppBuilder';
    }
  ])
;
