/* jshint node:true, browser: true */
var angular = require('angular');

angular.module('AppBuilder')
  .directive('abResources', ['$timeout', function($timeout) {

    // Globally available files
    var _files = [];

    return {
      restrict: 'E',
      scope: {
        'selectMode': '=',
        'selectedFiles': '=',
        'typeMatch': '='
      },
      template: require('./templates/resources.html!text'),
      link: function(scope, element) {

        // Available files
        scope.files = _files;

        element.bind('dragend dragover', function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          return false;
        });

        element.bind('drop', function(evt) {

          evt.stopPropagation();
          evt.preventDefault();

          for(var f, i = 0; (f = evt.dataTransfer.files[i]); i++) {

            if(f.path) { // nw.js context
              addFile(f.name, f.type, f.path);
            } else { // browser context
              var reader = new FileReader();
              reader.onload = fileLoadedHandler.bind(reader, f);
              reader.readAsDataURL(f);
            }

          }

          function fileLoadedHandler(f, evt) {
            this.onload = null;
            addFile(f.name, f.type, evt.target.result);
          }

          function addFile(name, type, path) {

            for(var f, i = 0; (f = _files[i]); i++) {
              // File is already added, do nothing
              if( f.path === path ) {
                return;
              }
            }

            $timeout(function() {
              scope.files.push({name: name, type: type, path: path });
            });

          }

          return false;

        });

      },
      controller: function($scope) {

        $scope.toggleFileSelection = function(file) {

          // If selectedFiles is defined
          if($scope.selectedFiles) {

            var found = false;

            // We search for the file in selected file
            for(var f, i = 0; (f = $scope.selectedFiles[i]); i++) {
              // If file is already added, we remove it
              if( f.path === file.path ) {
                $scope.selectedFiles.splice(i, 1);
                found = true;
              }
            }

            // File was not found, we add it to the selected files
            if(!found) {
              $scope.selectedFiles.push(file);
            }

          }

        };

        $scope.matchTypeFilter = function(file) {
          return true;
          // TODO implement file type filter
        };

      }
    };
  }])
;
