'use strict';

var assert = require('assert');
var path = require('path');
var htmlimport = require('./');
var cheerio = require('cheerio');

/* generated html sample
<html>
<head>
<link rel="import" href="$PWD/core-scaffold/core-scaffoldjs">
<link rel="import" href="$PWD/core-toolbar/core-toolbarjs">
<link rel="import" href="$PWD/core-header-panel/core-header-paneljs">
</head>
</html>
*/

it ('should generated links for import', function(cb) {
  var polypath = function(name) {
    return path.join(__dirname, name, name + 'js');
  };

  var srcs = [
    polypath('core-scaffold'),
    polypath('core-toolbar'),
    polypath('core-header-panel')
  ];

  var stream = htmlimport.src(srcs);

  stream.on('data', function(file) {;
    var html = file.contents.toString();
    var $ = cheerio.load(html);

    assert(html);
    assert.equal($('link').length, 3);
    srcs.forEach(function(src) {
      var regex = new RegExp('<link rel="import" href="' + src + '">', 'gi');
      assert(regex.test(html));
    })

  });

  stream.on('end', cb);

  stream.end();
});
