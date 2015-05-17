/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('AppLoader', [
    '$q', 'Resources',
    function($q, Resources) {

      this.loadApp = function(app) {
        return Resources.load(app.resources);
      };

    }
  ])
;
