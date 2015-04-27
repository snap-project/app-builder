/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .run(['WidgetsRegistry', function(WidgetsRegistry) {

    WidgetsRegistry.addDefinition({
      tag: 'hello-world-widget',
      title: 'Hello World',
      description: 'A basic Hello World widget. Serve as a demo',
      configTemplate: require('./templates/config.html!text')
    });

  }])
  .directive('helloWorldWidget', function() {
    return {
      restrict: 'E',
      template: require('./templates/content.html!text'),
      scope: {
        data: '=widgetData'
      }
    };
  })
  .directive('helloWorldWidgetConfig', function() {
    return {
      restrict: 'E',
      template: require('./templates/config.html!text'),
      scope: {
        data: '=widgetData'
      }
    };
  })
;
