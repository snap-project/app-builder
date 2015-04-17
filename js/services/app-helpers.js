/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('AppHelpers', [
    '$http', '$q',
    function($http, $q) {

      this.loadAppManifest = function(appDir) {
        var url = (appDir ? appDir  : '.') + '/manifest.webapp';
        return $http.get(url);
      };

      this.saveApp = function(appDir, pages) {
        return $q(function(resolve, reject) {

          if(!global.require) {
            return reject('Can\'t save in browser context !');
          }

          var dirSelector = document.getElementById('_dirSelector');
          dirSelector.addEventListener('change', dirChangeHandler, false);
          dirSelector.click();

          function dirChangeHandler(evt) {
            dirSelector.removeEventListener('change', dirChangeHandler);
            var dirPath = evt.target.value;

          }

        });
      };

    }
  ])
;
