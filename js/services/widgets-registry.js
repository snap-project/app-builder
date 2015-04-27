/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('WidgetsRegistry', function() {

    var _definitions = [];

    this.addDefinition = function(widgetDefinition) {

      _definitions.push({
        tag: widgetDefinition.tag,
        description: widgetDefinition.description,
        title: widgetDefinition.title,
        defaultData: widgetDefinition.defaultData
      });

    };

    this.getDefinitions = function() {
      return _definitions;
    };

    this.getDefinitionByTag = function(tag) {
      return _definitions.reduce(function(result, widget) {
        if(widget.tag === tag) {
          result = widget;
        }
        return result;
      }, null);
    };

    this.createWidgetForTag = function(tag) {

      var definition = this.getDefinitionByTag(tag);

      if(!definition) {
        throw new Error('Unknown widget tag "' + tag + '" !');
      }

      return {
        tag: tag,
        data: angular.copy(definition.defaultData || {}),
        tile: {
          row: null,
          col: null,
          sizeX: null,
          sizeY: null
        }
      };

    };

  })
;
