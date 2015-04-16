/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('AppHelpers', [
    '$http',
    function($http) {

      this.loadAppManifest = function(appDir) {
        var url = (appDir ? appDir  : '.') + '/manifest.webapp';
        return $http.get(url);
      };

      this.saveAppManifest = function(manifest, appDir) {
        var url = (appDir ? appDir  : '.') + '/manifest.webapp';
        // TODO
      };

    }
  ])
;
