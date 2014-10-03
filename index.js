'use strict';

var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var through = require('through2');
var gutil = require('gulp-util');
var serializer = require('dom-serializer');
var mkdirp = require('mkdirp');
var error = gutil.PluginError;

var INLINE_SCRIPT = 'script:not([type]):not([src]), script[type="text/javascript"]:not([src])';

function append($, src) {;
  var last = $('body').last();
  if (!last.length) {
    last = $.root();
  }

  last.append('<script src="' + src + '"></script>');
};

function cspify (options) {
	options = options || {};

  var stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    } else if (file.isStream()) {
      return cb(new error('gulp-csp-fixer', 'Streaming not supported'));
    }

    // create dest directory if it passed
    if (options.dest) {
      mkdirp.sync(options.dest);
    }

    var destpath = options.dest || path.dirname(file.path);
    var fullname = path.basename(file.path);
    var basename = path.basename(file.path, '.html');

    var precsp = path.resolve(destpath, fullname + '.pre_csp');

    fs.readFile(file.path, function(err, data) {
      if (err) {
        return cb(new error('gulp-csp-fixer', 'Target file is not exist'))
      }

      var $ = cheerio.load(data);
      var sid = 0;

      // backup pre-uncsp polymer file
      fs.writeFileSync(precsp, data, 'utf-8');

      $(INLINE_SCRIPT).each(function() {
        var scriptname = basename + '_' + sid++ + '.js';

        // write script file
        fs.writeFileSync(path.resolve(destpath, scriptname), $(this).text(), 'utf-8');

        // remove script tag
        $(this).remove();

        // append script:src block
        append($, scriptname);
      });

      // dump cspify version html
      fs.writeFileSync(path.resolve(destpath, fullname),
          serializer($._root.children, cheerio.prototype.options),
          'utf-8');

      cb();
    });

  });

  return stream;

}


module.exports = cspify;
