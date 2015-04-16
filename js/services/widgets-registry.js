/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('WidgetsRegistry', function() {

    var _register = {};

    this.registerWidget = function(widgetType, widgetName, widgetDescription) {
      _register[widgetType] = {
        name: widgetName,
        description: widgetDescription
      };
    };

    this.getRegisteredWidgets = function() {
      return _register;
    };

  })
;
