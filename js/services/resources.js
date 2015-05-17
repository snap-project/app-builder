/* jshint node:true */
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
;
