/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('AppHelpers', [
    '$http', '$q',
    function($http, $q) {

      var _currentApp = {};

      this.newApp = function(manifest) {

        manifest = manifest || {};
        var appBuilder = manifest.appBuilder || {};

        _currentApp.pages = appBuilder.pages || {};
        _currentApp.resources = appBuilder.resource || {};
        _currentApp.info = {
          name: manifest.name || '',
          version: manifest.version || '0.0.0',
          author: manifest.author || '',
          licence: manifest.licence || ''
        };
        _currentApp.path = null;
        return _currentApp;
      };

      this.newApp();

      this.getCurrentApp = function() {
        return _currentApp;
      };

      this.loadAppManifest = function(appDir) {
        var url = (appDir ? appDir  : '.') + '/manifest.webapp?t='+Date.now();
        return $http.get(url);
      };

      this.openApp = function() {

        _assertDesktopContext();

        var self = this;

        return $q(function(resolve, reject) {

          _selectDir(function(appDir) {

            if(!appDir) {
              return reject();
            }

            self.loadAppManifest(appDir)
              .success(function(manifest) {

                if(manifest && manifest.appBuilder) {
                  var currentApp = self.newApp(manifest);
                  currentApp.path = appDir;
                  return resolve();
                }

              })
              .error(reject);

          });

        });

      };

      this.saveApp = function(saveAs) {

        _assertDesktopContext();

        var currentApp = this.getCurrentApp();
        var appManifest = _createAppManifest(currentApp);

        return $q(function(resolve, reject) {

          if(saveAs || !currentApp.path) {
            _selectDir(function(appDir) {

              if(!appDir) {
                return reject();
              }

              currentApp.path = appDir;

              return _saveApp(appDir);

            });
          } else {
            return _saveApp(currentApp.path);
          }

          function _saveApp(appDir) {
            _copyAppFilesToDir(appManifest, appDir, function(err) {
              if(err) {
                return reject(err);
              }
              return resolve();
            });
          }

        });

      };

      /*
       * Fonctions privées
       */

      function _copyAppFilesToDir(appManifest, appDir, cb) {

        var async = global.require('async');

        async.series([
          _localFilesCopyFactory('bower_components', appDir),
          _localFilesCopyFactory('js/directives', appDir),
          _localFilesCopyFactory('js/services', appDir),
          _localFilesCopyFactory('js/widgets', appDir),
          _localFilesCopyFactory('app-template', appDir, ''),
          _localFilesCopyFactory('index.html', appDir),
          _localFilesCopyFactory('bower.json', appDir),
          _saveAppManifestFactory(appManifest, appDir)
        ], cb);

      }

      function _createAppManifest(app) {
        return {
          name: app.info.name,
          version: app.info.version,
          description: app.info.description,
          author: app.info.author,
          licence: app.info.licence,
          appBuilder: {
            resources: app.resources,
            pages: app.pages,
            generatedAt: new Date().toJSON()
          }
        };
      }

      function _saveAppManifestFactory(manifest, appDir) {

        var path = global.require('path');
        var fs = global.require('fs-extra');

        var manifestPath = path.join(appDir, 'manifest.webapp');

        return function(cb) {
          return fs.writeJSON(manifestPath, manifest, cb);
        };

      }

      function _localFilesCopyFactory(localPath, destDir, destDirPath)  {

        var fs = global.require('fs-extra');
        var path = global.require('path');

        var localRootDir = path.join(__dirname, '../..');

        return function(cb) {
          fs.copy(
            path.join(localRootDir, localPath),
            path.join(destDir, destDirPath !== undefined ? destDirPath : localPath),
            cb
          );
        };

      }

      function _selectDir(cb) {

        var dirSelector = document.getElementById('_dirSelector');
        dirSelector.addEventListener('change', dirChangeHandler, false);
        dirSelector.click();

        function dirChangeHandler(evt) {
          dirSelector.removeEventListener('change', dirChangeHandler);
          var dirPath = evt.target.value;
          return cb(dirPath);
        }

      }

      function _assertDesktopContext() {
        if(!global.require) {
          throw new Error('This feature can\'t be used in the browser !');
        }
      }

    }
  ])
;
