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
        var tpl = $compile(scope.template);
        var childScope = scope.$new(true);
        angular.extend(childScope, scope.expose);
        var el = tpl(childScope);
        element.append(el);
      }
    };
  }])
;
