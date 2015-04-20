/* jshint node: true */
var _ = require('lodash');
var path = require('path');

module.exports = function(grunt) {

  var NW_VERSION = '0.12.1';
  var BUILD_DIR = 'build';
  var BUILD_TARGETS = {
    linux_ia32: true,
    linux_x64: true,
    win: true,
    osx: false
  };
  var PKG = grunt.file.readJSON('package.json');
  var BOWER = grunt.file.readJSON('bower.json');
  var PKG_OVERWRITE = {
    window: {
      toolbar: false
    }
  };

  // Create build tasks options
  var buildOptions = _.merge({
    runtimeVersion: NW_VERSION
  }, BUILD_TARGETS);

  // Define copy:build tasks files
  var appFiles = [];

  _.forEach(BUILD_TARGETS, function(isEnabled, target) {

    if(!isEnabled) return;

    var arch = 'ia32';
    var platform = target;
    if(platform.indexOf('linux') !== -1) {
      arch = platform.split('_')[1];
      platform = 'linux';
    }
    var dirName = PKG.name + '-' + PKG.version + '-' + platform + '-' + arch;
    var destPath = path.join(BUILD_DIR, dirName + '/');

    // Retreive NPM dependencies
    var npmDeps = _.keys(PKG.dependencies).map(function(moduleName) {
      return path.join('node_modules', moduleName, '**');
    });
    appFiles.push({ src: npmDeps, dest: destPath });

    // Retreive Bower dependencies
    var bowerDeps = _.keys(BOWER.dependencies).map(function(moduleName) {
      return path.join('bower_components', moduleName, '**');
    });
    appFiles.push({ src: bowerDeps, dest: destPath });

    // Add main files, licence, & config
    appFiles.push({
      src: [
        'index.html',
      ],
      dest: destPath
    });

  });

  // Configure tasks
  grunt.initConfig({

    pkg: PKG,

    download: {
      options: {
        runtimeVersion: NW_VERSION
      }
    },

    run: {
      options: {
        nwArgs: [grunt.option('test') ? 'test/runner' : '.'],
        runtimeVersion: NW_VERSION
      }
    },

    build: {
      options: buildOptions
    },

    clean: {
      build: [BUILD_DIR]
    },

    copy: {
      build: {
        files: appFiles,
        options: {
          noProcess: ['**','!package.json'],
          process: function() {
            var pkg = _.merge(PKG, PKG_OVERWRITE);
            return JSON.stringify(pkg, null, 2);
          }
        }
      }
    }

  });

  grunt.registerTask('app-builder:run',  ['download', 'run']);
  grunt.registerTask(
    'app-builder:build',
    ['download', 'clean:build', 'build', 'copy:build']
  );
  grunt.registerTask('default', ['app-builder:run']);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-nw');

};
