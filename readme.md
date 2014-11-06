# [gulp](http://gulpjs.com)-htmlimport

> Generator a html having [HTML import links](http://www.w3.org/TR/html-imports/#link-type-import)

## Install

```sh
$ npm install --save-dev gulp-htmlimport
```


## Usage

```js
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var htmlimport = require('gulp-htmlimport');
var bowercfg = require('bower-config').read();

gulp.task('default', function () {
  var polypath = function(name) {
    return path.join(bowercfg.cwd, bowercfg.directory, name, name + 'js');
  };

  return htmlimport({
    imports: [
      polypath('core-scaffold'),
      polypath('core-toolbar'),
      polypath('core-header-panel')
    ]
  })
  .pipe(vulcanize({
    csp:true
  }))
  .pipe(gulp.dest('dist'));
});
```

## API

### htmlimport(options)

#### options.imports

Type: `Array`

The target components list to import. this plugin also supports [glob pattern](https://github.com/isaacs/node-glob)

## License

MIT
