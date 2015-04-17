/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .value('abDragDrop', {draggedModel: null})
  .directive('abDrag', ['abDragDrop', function(abDragDrop) {
    return {
      restrict: 'A',
      scope: {
        'model': '=abDrag'
      },
      link: function(scope, element, attrs) {
        attrs.$set('draggable', true);
        element.bind('dragstart', function() {
          abDragDrop.draggedModel = scope.model;
        });
        element.bind('dragend', function() {
          abDragDrop.draggedModel = null;
        });
      }
    };
  }])
  .directive('abDrop', ['abDragDrop', function(abDragDrop) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        element.bind('dragenter', function(evt) {
          evt.preventDefault();
        });

        element.bind('dragover', function(evt) {
          evt.preventDefault();
        });

        element.bind('drop', function(evt) {
          scope.$emit('abDrop', {model: abDragDrop.draggedModel, originalEvent: evt});
        });

      }
    };
  }])
;
