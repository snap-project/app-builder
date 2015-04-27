/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('WidgetsListCtrl', [
    '$scope', 'WidgetsRegistry',
    function($scope, WidgetsRegistry) {

      $scope.widgets = WidgetsRegistry.getDefinitions();

    }
  ])
;
