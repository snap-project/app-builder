/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .directive('abCompile', ['$compile', function($compile) {
    return {
      restrict: 'E',
      scope: {
        'template': '=',
        'expose': '='
      },
      link: function(scope, element) {
        scope.$watch('template', function(template) {
          if(template) {
            var tpl = $compile(template);
            var childScope = scope.$new(true);
            angular.extend(childScope, scope.expose);
            var el = tpl(childScope);
            element.html('').append(el);
          }
        });
      }
    };
  }])
;
