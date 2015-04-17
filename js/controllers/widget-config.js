/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('WidgetConfigCtrl', [
    '$scope', 'WidgetsRegistry', '$timeout',
    function($scope, WidgetsRegistry, $timeout) {

      $scope.configTemplate = '';
      $scope.widgetData = null;

      $scope.$on('abPageWidgetFocus', function(evt, widget) {
        var widgetDef = WidgetsRegistry.getSchemaByTag(widget.type);
        $scope.configTemplate = '';
        $timeout(function() {
          $scope.configTemplate = widgetDef ? widgetDef.configTemplate : '';
          $scope.widgetData = widget.data;
        });
      });

    }
  ])
;
