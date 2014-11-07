'use strict';

var through = require('through2');
var File = require('vinyl');

var importlink = {
  src: function(imports) {
    var html = ['<!doctype html>', '<html>', '<head>'];

    imports.forEach(function(link) {
      html.push('<link rel="import" href="' + link + '">');
    });

    html.push('</head>', '</html>');

    var stream = through.obj();

    stream.write(new File({
      contents: new Buffer(html.join('\n'))
    }));

    return stream;
  }
};

module.exports = importlink;
