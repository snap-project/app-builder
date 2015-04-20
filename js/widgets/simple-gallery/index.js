/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .run(['WidgetsRegistry', function(WidgetsRegistry) {

    WidgetsRegistry.addSchema({
      tag: 'simple-gallery-widget',
      title: 'Simple Gallery',
      description: 'A simple image gallery',
      configTemplate: require('./templates/config.html!text')
    });

  }])
  .directive('simpleGalleryWidget', function() {
    return {
      restrict: 'E',
      template: require('./templates/content.html!text'),
      scope: {
        data: '=widgetData'
      },
      controller: function($scope) {
        $scope.currentImage = null;
        $scope.$watch('data.selectedImages.length', function() {
          if($scope.data.selectedImages && !$scope.currentImage) {
            $scope.currentImage = $scope.data.selectedImages[0];
          }
        });
      }
    };
  })
  .controller('simpleGalleryWidgetConfigCtrl', ['$scope', function($scope) {
    $scope.data.selectedImages = $scope.data.selectedImages || [];
  }])
;
