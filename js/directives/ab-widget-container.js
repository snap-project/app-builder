/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .directive('abWidgetContainer', [
    '$compile',
    function($compile) {
      return {
        restrict: 'E',
        template: '<div class="panel panel-default" style="height: 100%"><div ng-if="title" class="panel-heading"><h3 class="panel-title">{{title}}</h3></div><div class="panel-body"></div></div>',
        scope: {
          'data': '=widgetData',
          'type': '=widgetType',
          'title': '=widgetTitle'
        },
        link: function(scope, element) {
          var tpl = $compile('<'+scope.type+' widget-data="data"></'+scope.type+'>');
          var el = tpl(scope);
          angular.element(element.find('div')[1]).append(el);
        }
      };
    }
  ])
;
