# [gulp](http://gulpjs.com)-polymports

> Generator a HTML having [HTML Import links](http://www.w3.org/TR/html-imports/#link-type-import) to pass it to vulcanize

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

gulp.task('default', function () {
  return polymports({
    "components.html": {
      imports: [
        'core-scaffold',
        'core-toolbar',
        'core-header-panel'
      ],
      basepath: require('bower-config').read().directory
    },
    "animations.html": {
      imports: [
        'core-ajax',
        'core-animation'
      ]
    }
  })
  .pipe(vulcanize({
    csp:true
  }))
  .pipe(gulp.dest('dist'));
});
```

## API

### polymports(configs)

The key name should be filename what you want. the name will be passed through [vinyl](http://goo.gl/rfHo00)'s path property on the stream. If configs type is string, that mean is config file as json, this plugin will try to load config data from file.

#### configs.imports

Type: `Array`

The component name list to import.

#### configs.basepath

Type: `String`

Pass a new base path If you want to change to what you want to it, which is not in .bowerrc.

## License

MIT @[ragingwind](http://github.com/ragingwind)
