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
        element.bind('dragstart', function(evt) {
          evt.dataTransfer.effectAllowed = 'move';
          evt.dataTransfer.setData('text/html', ''); // Mandatory for Firefox
          abDragDrop.draggedModel = scope.model;
        });
        element.bind('dragend', function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          abDragDrop.draggedModel = null;
          return false;
        });
      }
    };
  }])
  .directive('abDrop', ['abDragDrop', function(abDragDrop) {
    return {
      restrict: 'A',
      link: function(scope, element) {

        element.bind('dragenter dragover', function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          return false;
        });

        element.bind('drop', function(evt) {
          scope.$emit('abDrop', {model: abDragDrop.draggedModel, originalEvent: evt});
        });

      }
    };
  }])
;
