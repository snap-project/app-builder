/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .run([
    'WidgetsRegistry', 'StyleInjector',
    function(WidgetsRegistry, StyleInjector) {

      WidgetsRegistry.addDefinition({
        tag: 'simple-gallery-widget',
        title: 'Simple Gallery',
        description: 'A simple image gallery'
      });

      StyleInjector.add(require('./assets/css/style.css!text'));

    }
  ])
  .directive('simpleGalleryWidget', ['Resources', function(Resources) {
    return {
      restrict: 'E',
      template: require('./templates/content.html!text'),
      scope: {
        data: '=widgetData'
      },
      controller: function($scope) {

        $scope.Resources = Resources;
        $scope.currentImage = null;

        $scope.$watch('data.selectedImages.length', function() {
          if($scope.data.selectedImages && !$scope.currentImage) {
            $scope.currentImage = $scope.data.selectedImages[0];
          }
        });

        $scope.selectImage = function(img) {
          $scope.currentImage = img;
        };

      }
    };
  }])
  .directive('simpleGalleryWidgetConfig', function() {
    return {
      restrict: 'E',
      template: require('./templates/config.html!text'),
      scope: {
        data: '=widgetData'
      },
      controller: function($scope) {
        $scope.data.selectedImages = $scope.data.selectedImages || [];
      }
    };
  })
;
