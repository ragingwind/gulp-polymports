'use strict';

var path = require('path');
var through = require('through2');
var bowercfg = require('bower-config').read();
var File = require('vinyl');

module.exports = {
  src: function(configs) {
    var stream = through.obj();

    // load configs from json if configs is string type
    if (typeof configs === 'string') {
      configs = require(configs);
    }

    // we must be needed configs
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
        output.push('<link rel="import" href="' +
            path.join(component.basepath, name, name + '.html') + '">');
      });

      output.push('</head>', '</html>');

      stream.write(new File({
        path: filename,
        contents: new Buffer(output.join('\n'))
      }));
    });

    return stream;
  }
};
