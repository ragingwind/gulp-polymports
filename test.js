'use strict';

var assert = require('assert');
var fs = require('fs');
var gutil = require('gulp-util');
var cspify = require('./');

it ('should html separated into js and html', function(cb) {
  var stream = cspify({dest: 'tmp'});

  stream.on('data', function(file) {
    console.log('data', file);
    assert.equal(0, 0);
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    cwd: __dirname,
    base: __dirname + '/fixture',
    path: __dirname + '/fixture/element.html',
    contents: fs.readFileSync('fixture/element.html')
  }));

  stream.end();
});
