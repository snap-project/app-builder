/* jshint node:true, browser: true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('Resources', function() {

    var _resources = {};

    function _hashCode(str) {
      return str.split('').reduce(function(a, b) {
        a = ( ( a << 5 ) - a ) + b.charCodeAt(0);
        return a&a;
      }, 0);
    }

    this.add = function(name, type, url) {
      var resourceId = 'res_' + _hashCode(url).toString(16);
      _resources[resourceId] = {
        name: name,
        type: type,
        url: url
      };
      return resourceId;
    };

    this.remove = function(resourceId) {
      delete _resources[resourceId];
    };

    this.getUrl = function(resourceId) {
      return resourceId in _resources ? _resources[resourceId].url : null;
    };

    this.getName = function(resourceId) {
      return resourceId in _resources ? _resources[resourceId].name : null;
    };

    this.getType = function(resourceId) {
      return resourceId in _resources ? _resources[resourceId].type : null;
    };

    this.getAvailables = function() {
      return Object.keys(_resources);
    };

    this.hasResources = function() {
      return this.getAvailables().length > 0;
    };

  })
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
