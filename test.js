'use strict';

var assert = require('assert');
var path = require('path');
var cheerio = require('cheerio');
var polymports = require('./');
var basepath = 'fixture/components';

function do_test(configs, cb) {
  var stream = polymports.src(configs);

  stream.on('data', function(file) {
    var html = file.contents.toString();
    var $ = cheerio.load(html);
    var config = configs[file.path];

    assert(html);
    assert.equal($('link').length, config.imports.length);

    config.imports.forEach(function(name) {
      var href = path.join(basepath, name, name.indexOf('.html') >= 0 ? '' : name + '.html');
      var regex = new RegExp('<link rel="import" href="' + href + '">', 'gi');
      assert(regex.test(html));
    })

  });

  stream.on('end', cb);

  stream.end();
}

it ('should generated links for configs object', function(cb) {
  var configs = {
    "bundle.html": {
      imports: [
        'core-scaffold',
        'core-toolbar',
        'core-header-panel',
        "core-icons"
      ],
      basepath: basepath
    },
    "bundle2.html": {
      imports: [
        'core-ajax',
        'core-animation',
        'core-menu',
        "core-icons/maps-icons.html"
      ],
      basepath: basepath
    }
  };

  do_test(configs, cb);
});

it ('should generated links for configs file', function(cb) {
  do_test(require('./fixture/imports.json'), cb);
});
