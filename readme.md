# [gulp](http://gulpjs.com)-polymports

> Generator a html having [HTML Import links](http://www.w3.org/TR/html-imports/#link-type-import) for Polymer elements

## Install

```sh
$ npm install --save-dev gulp-polymports
```


## Usage

```js
var gulp = require('gulp');
var path = require('path');
var vulcanize = require('gulp-vulcanize');
var polymports = require('gulp-polymports');
var bowercfg = require('bower-config').read();

gulp.task('default', function () {
  var polypath = function(name) {
    return path.join(bowercfg.cwd, bowercfg.directory, name, name + 'js');
  };

  return polymports([
      polypath('core-scaffold'),
      polypath('core-toolbar'),
      polypath('core-header-panel')
  ])
  .pipe(vulcanize({
    csp:true
  }))
  .pipe(gulp.dest('dist'));
});
```

## API

### polymports(options)

#### options.imports

Type: `Array`

The target components list to import. this plugin also supports [glob pattern](https://github.com/isaacs/node-glob)

## License

MIT
