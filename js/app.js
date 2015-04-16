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
        .when('/', {
          template: require('./templates/workspace.html!text')
        })
        .otherwise('/')
      ;

    }
  ])
;

require('./services/index');
require('./directives/index');
require('./widgets/index');
require('./controllers/index');
