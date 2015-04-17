/* jshint node:true */

var angular = require('angular');

// Application dependencies
require('angular-gridster/dist/angular-gridster.min');
require('angular-route/angular-route');

angular.module('AppBuilder', ['ngRoute', 'gridster']);

angular.module('AppBuilder')
  .config([
    '$routeProvider',
    function($routeProvider) {

      $routeProvider
        .when('/:pageId?', {
          template: require('./templates/page.html!text')
        })
        .otherwise('/')
      ;

    }
  ])
  .controller('MainCtrl', [
    '$scope', 'AppHelpers',
    function($scope, AppHelpers) {

      $scope.appTitle = '';
      $scope.manifest = null;

      AppHelpers.loadAppManifest()
        .success(function(manifest) {
          $scope.manifest = manifest;
        })
        .error(function(err) {
          console.error(err);
        })
      ;

    }
  ])
  .controller('PageCtrl', [
    '$scope', '$routeParams',
    function($scope, $routeParams) {

      $scope.currentPage = [];

      $scope.gridOpts = {
        draggable: {
          enabled: false
        },
        resizable: {
          enabled: false
        }
      };

      $scope.$watch('manifest', function(manifest) {

        if(!manifest) return;

        var appBuilder = manifest.appBuilder;
        var pages = Object.keys(appBuilder.pages);
        var page = appBuilder.pages[$routeParams.pageId];

        if(!page) {
          page = appBuilder.pages[Object.keys(appBuilder.pages)[0]];
        }

        if(!page) return;

        $scope.currentPage = page;

      });

    }
  ])
;

require('./services/index');
require('./directives/index');
require('./widgets/index');
