'use strict';

var path = require('path');
var through = require('through2');
var bowercfg = require('bower-config').read();
var File = require('vinyl');
var fs = require('fs');
var gutil = require('gulp-util');

module.exports = {
  src: function(configs) {
    var stream = through.obj();

    // load configs from json if configs is string type
    if (typeof configs === 'string') {
      configs = require(configs);
    }

    // configs must be required
    if (!configs) {
      throw new Error('We need a link list for HTML Import');
    }

    // generate html which is having HTML import link list for Polymer
    Object.keys(configs).forEach(function(filename) {
      var output = ['<!doctype html>', '<html>', '<head>'];
      var component = configs[filename];

      if (!component.basepath) {
        component.basepath = bowercfg.directory;
      }

      component.imports.forEach(function(name) {
        var element = path.join(component.basepath, name);

        try {
          if (fs.statSync(element).isDirectory()) {
            element = path.join(element, name + '.html');
          }
          if (!fs.existsSync(path.resolve(element))) {
            throw 'No such imports file ' + element;
          }
        } catch (e) {
          throw new gutil.PluginError('gulp-polymports', e.message);
        }

        output.push('\t<link rel="import" href="' + element + '">');
      });

      output.push('</head>', '</html>');

      stream.write(new File({
        path: filename,
        contents: new Buffer(output.join('\n'))
      }));

      // flushing
      process.nextTick(stream.end.bind(stream));
    });

    return stream;
  }
};
