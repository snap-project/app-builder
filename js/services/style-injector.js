/* jshint node:true */
var angular = require('angular');

angular.module('AppBuilder')
  .service('StyleInjector', ['$rootElement', function($rootElement) {

    var _styles = [];
    var _el = angular.element('<style />');

    this.add = function(style) {
      if(_styles.indexOf(style) === -1) {
        _styles.push(style);
      }
      _el.text(_styles.join('\n'));
    };

    this.inject = function() {
      $rootElement.prepend(_el);
    };

  }])
  .run(['StyleInjector', function(StyleInjector) {
    StyleInjector.inject();
  }])
;
