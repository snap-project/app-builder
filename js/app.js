/* jshint node:true */

var angular = require('angular');

var deps = require('./deps');

angular.module('AppBuilder', deps);

angular.module('AppBuilder')
  .config([
    '$routeProvider',
    function($routeProvider) {

      $routeProvider
        .when('/select-app', {
          template: require('./templates/select-app.html!text')
        })
        .when('/workspace', {
          template: require('./templates/workspace.html!text'),
          resolve: {
            load: [
              '$q', '$location', 'Apps', 'AppLoader',
              function($q, $location, Apps, AppLoader) {
                if(!Apps.getCurrentApp()) {
                  $location.path('/select-app');
                  return $q.reject();
                }
                return AppLoader.loadApp(Apps.getCurrentApp());
              }
            ]
          }
        })
        .otherwise('/select-app')
      ;

    }
  ])
;

require('./services/index');
require('./directives/index');
require('./widgets/index');
require('./controllers/index');
