/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('Apps', [
    '$q', 'Resources',
    function($q, Resources) {

      var _apps = [];
      var _currentApp = null;

      this.newApp = function(name) {
        return new App(name);
      };

      this.setCurrentApp = function(app) {
        _currentApp = app;
      };

      this.getCurrentApp = function() {
        return _currentApp;
      };

      this.fetchList = function() {
        return $q.when(_apps);
      };

      this.save = function(app) {
        app.resources = Resources.toJSON();
        return $q(function(resolve) {
          var index = _apps.indexOf(app);
          if( index === -1) {
            _apps.push(app);
          } else {
            _apps.splice(index, 1, app);
          }
          return resolve(app);
        });
      };

      // App class

      function App(name) {
        this.name = name || 'New app ' + new Date();
        this.pages = [];
        this.resources = {};
      }

      App.fromWebAppManifest = function(appManifest) {
        // TODO
      };

      App.prototype.toWebAppManifest = function() {
        return {

        };
      };

      App.prototype.newPage = function() {
        var page = [];
        this.pages.push(page);
        return this.pages.length-1;
      };

    }
  ])
;
