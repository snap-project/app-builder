/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .run(['WidgetsRegistry', function(WidgetsRegistry) {
    WidgetsRegistry.registerWidget('hello-world-widget', 'Hello World', 'A basic Hello World widget. Serve as a demo');
  }])
  .directive('helloWorldWidget', function() {
    return {
      restrict: 'E',
      template: '<div>Hello {{data.user}} !</div>',
      scope: {
        data: '=widgetData'
      }
    };
  })
;
