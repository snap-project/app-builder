/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .controller('WidgetConfigCtrl', [
    '$scope', 'WidgetsRegistry',
    function($scope, WidgetsRegistry) {

      $scope.exposedData = {
        widgetData: null
      };

      $scope.$on('abPageWidgetFocus', function(evt, widget) {
        $scope.exposedData.widgetData = widget.data;
        var widgetDefinition = WidgetsRegistry.getDefinitionByTag(widget.tag);
        $scope.widgetConfigTemplate = '<'+widgetDefinition.tag+'-config ' +
          'widget-data="widgetData" class="widget-config-' + Date.now() + '">' +
          '</'+widgetDefinition.tag+'-config>'
        ;
      });

    }
  ])
;
