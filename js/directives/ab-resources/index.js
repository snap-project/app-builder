/* jshint node:true, browser: true */
var angular = require('angular');

angular.module('AppBuilder')
  .directive('abResources', [
    '$timeout', 'Resources',
    function($timeout, Resources) {

      return {
        restrict: 'E',
        scope: {
          'selectMode': '=',
          'sResources': '=selectedResources',
          'typeMatch': '='
        },
        template: require('./templates/resources.html!text'),
        link: function(scope, element) {

          // Available files
          scope.Resources = Resources;

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
                Resources.add(f.name, f.type, f.path);
              } else { // browser context
                var reader = new FileReader();
                reader.onload = fileLoadedHandler.bind(reader, f);
                reader.readAsDataURL(f);
              }

            }

            function fileLoadedHandler(f, evt) {
              this.onload = null;
              $timeout(function() {
                Resources.add(f.name, f.type, evt.target.result);
              });
            }

            return false;

          });

        },
        controller: function($scope) {

          $scope.srModels = {};

          $scope.$watch('sResources.length', function() {
            var sResources = $scope.sResources;
            if(sResources) {
              $scope.srModels = {};
              sResources.forEach(function(rId) {
                $scope.srModels[rId] = true;
              });
            }
          });

          $scope.selectResource = function(rId) {

            var sResources = $scope.sResources;

            if(sResources) {
              var rIndex = sResources.indexOf(rId);
              if(rIndex !== -1) {
                sResources.splice(rIndex, 1);
              } else {
                sResources.push(rId);
              }
            }

          };

        }
      };
    }
  ])
;
