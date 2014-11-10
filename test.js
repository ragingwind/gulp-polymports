'use strict';

var assert = require('assert');
var path = require('path');
var bowercfg = require('bower-config').read();
var cheerio = require('cheerio');
var polymports = require('./');

function do_test(configs, cb) {
  var stream = polymports.src(configs);

  stream.on('data', function(file) {
    var html = file.contents.toString();
    var $ = cheerio.load(html);
    var config = configs[file.path];
    var basepath = config.basepath || bowercfg.directory

    assert(html);
    assert.equal($('link').length, config.imports.length);

    config.imports.forEach(function(name) {
      var regex = new RegExp('<link rel="import" href="' + path.join(basepath, name, name + '.html') + '">', 'gi');
      assert(regex.test(html));
    })

  });

  stream.on('end', cb);

  stream.end();
}

it ('should generated links for configs object', function(cb) {
  var configs = {
    "components.html": {
      imports: [
        'core-scaffold',
        'core-toolbar',
        'core-header-panel'
      ],
      basepath: __dirname
    },
    "components2.html": {
      imports: [
        'core-ajax',
        'core-animation',
        'core-menu'
      ]
    }
  };

  do_test(configs, cb);
});

it ('should generated links for configs file', function(cb) {
  do_test(require('./fixture/imports.json'), cb);
});
