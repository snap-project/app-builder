/* jshint node:true */
var angular = require('angular');
var uuid = require('node-uuid/uuid');

angular.module('AppBuilder')
  .service('Resources', function() {

    var _resources = {};

    function _getResourceIdForUrl(url) {
      var resId, res;
      for(resId in _resources) {
        if(_resources.hasOwnProperty(resId)) {
          res = _resources[resId];
          if(res.url === url) {
            return resId;
          }
        }
      }
    }

    this.add = function(name, type, url) {

      var resourceId = _getResourceIdForUrl(url);

      if(resourceId) return resourceId;

      resourceId = uuid.v4();

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

    this.toJSON = function() {
      return _resources;
    };

    this.load = function(resources) {
      _resources = {};
      var resId, res;
      for(resId in resources) {
        if(resources.hasOwnProperty(resId)) {
          res = resources[resId];
          if(!_getResourceIdForUrl(res.url)) {
            _resources[resId] = {
              name: res.name,
              type: res.type,
              url: res.url
            };
          }
        }
      }
    };

  })
;
