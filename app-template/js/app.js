/* jshint browser:true */
/* globals angular, console */
angular.module('ABApp', ['ngRoute', 'gridster'])
  .config(['$routeProvider', function($routeProvider) {

    $routeProvider
      .when('/:pageId?', {
        template: '<ab-page page="pageId" grid-opts="gridOpts"></ab-page>',
        controller: 'PageController'
      })
      .otherwise('/')
    ;

  }])
  .directive('abPage', [
    '$compile', '$http',
    function($compile, $http) {
      return {
        restrict: 'E',
        scope: {
          'pageId': '=page',
          'gridOpts': '=gridOpts'
        },
        link: function(scope, element) {

          var pageId = scope.pageId;

          $http.get('../manifest.webapp')
            .success(function(manifest) {
              var page = manifest.appBuilder.pages[pageId];
              var grid = createGrid(page);
              element.append(grid);
            })
            .error(function(err) {
              console.error(err);
            })
          ;

          function createGrid(page) {

            var tpl = $compile(
              '<div gridster="gridsterOpts">' +
                '<ul>' +
                  '<li gridster-item="widget.tile" ng-repeat="widget in page">' +
                    '<ab-widget widget-type="widget.type" widget-data="widget.data"></ab-widget>' +
                  '</li>' +
                '</ul>' +
              '</div>'
            );

            var gridScope = scope.$new(true);

            gridScope.gridsterOpts = scope.gridOpts;
            gridScope.page = page;

            console.log(gridScope);

            return tpl(gridScope);

          }


        }
      };
    }
  ])
  .directive('abWidget', [
    '$compile',
    function($compile) {
      return {
        restrict: 'E',
        scope: {
          'data': '=widgetData',
          'type': '=widgetType'
        },
        link: function(scope, element) {
          var tpl = $compile('<'+scope.type+' widget-data="data"></'+scope.type+'>');
          var el = tpl(scope);
          element.append(el);
        }
      };
    }
  ])
  .directive('myWidget', function() {
      return {
        restrict: 'E',
        template: '<p>Hello {{data.foo}} !</p>',
        scope: {
          'data': '=widgetData',
        }
      };
    }
  )
  .controller('PageController', [
    '$routeParams', '$scope',
    function($routeParams, $scope) {

      $scope.pageId = $routeParams.pageId;

      $scope.gridOpts = {
        resizable: {
          enabled: false
        },
        draggable: {
          enabled: false
        }
      };

    }
  ])
;
