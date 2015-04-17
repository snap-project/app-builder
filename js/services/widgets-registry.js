/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('WidgetsRegistry', function() {

    var _register = [];

    this.addSchema = function(widgetSchema) {

      _register.push({
        tag: widgetSchema.tag,
        description: widgetSchema.description,
        title: widgetSchema.title,
        configTemplate: widgetSchema.configTemplate,
        defaultData: widgetSchema.defaultData
      });

    };

    this.getSchemas = function() {
      return _register;
    };

    this.getSchemaByTag = function(tag) {
      return _register.reduce(function(result, widget) {
        if(widget.tag === tag) {
          result = widget;
        }
        return result;
      }, null);
    };

    this.createWidgetForTag = function(tag) {

      var schema = this.getSchemaByTag(tag);

      if(!schema) {
        throw new Error('Unknown widget tag ' + tag + ' !');
      }

      return {
        type: tag,
        data: angular.copy(schema.defaultData || {}),
        tile: {
          row: null,
          col: null,
          sizeX: 1,
          sizeY: 1
        }
      };

    };

  })
;
