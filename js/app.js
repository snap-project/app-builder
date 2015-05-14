/* jshint node:true */

var angular = require('angular');

var deps = require('./deps');

angular.module('AppBuilder', deps);

angular.module('AppBuilder')
  .config([
    '$routeProvider',
    function($routeProvider) {

      $routeProvider
        .when('/', {
          template: require('./templates/layout.html!text')
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
