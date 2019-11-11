const gulp = require("gulp");
const cp = require("child_process");
const env = process.env.NODE_ENV || 'develop';
const bundleRb = process.platform === 'win32' ? 'bundle.bat' : 'bundle';
const favicons = require('favicons').stream;
const inlineCss = require('gulp-inline-css');
const postcss = require('gulp-postcss');
const responsive = require('gulp-responsive');

function jekyll(env) {
  if (env === 'distribute') {
    return jekyllDist = done => cp.spawn(bundleRb, ['exec', 'jekyll', 'build', ''], { stdio: 'inherit'});
  } else {
    return jekyllServe = done => cp.spawn(bundleRb, ['exec', 'jekyll', 'serve', '--incremental', '--drafts'], { stdio: 'inherit'});
  }
}

function responsiveImages() {
  return gulp.src('assets/images/**/*.{png,jpg}')
    .pipe(responsive(
      {
      '**/*.{png,jpg}': [{
        width: 760,
        rename: { suffix: '-default', },
      },{
        width: 320,
        rename: { suffix: '-mobile-s', },
      }, {
        width: 375,
        rename: { suffix: '-mobile-m', },
      }, {
        width: 425,
        rename: { suffix: '-mobile-l', },
      }, {
        width: 768,
        rename: { suffix: '-tablet', },
      }, {
        width: 1024,
        rename: { suffix: '-laptop', },
    }],
    }, {
      quality: 80,
      progressive: true,
      withMetadata: false,
      errorOnEnlargement: false
    }
    ))
    .pipe(gulp.dest('dist/images'))
}

function icons() {
  return gulp.src('assets/favicons/favicon.src.png')
    .pipe(favicons({
        appName: "clicktherapeutics",
        appShortName: "clickotine",
        appDescription: "",
        developerName: "",
        developerURL: "",
        background: "",
        path: "",
        url: "http://clickotine.com/",
        display: "standalone",
        orientation: "landscape",
        version: 1.0,
        logging: false,
        html: "../../html/favicons.html",
        pipeHTML: true,
        replace: true
    }))
    .pipe(gulp.dest('dist/favicons'))
}

function stylesheet() {
  return gulp.src('dist/*.html')
    .pipe(inlineCss())
    .pipe(gulp.dest('dist/'))
}

const emailCss = gulp.series(styles, inlineCss);
const artwork = gulp.series(icons, responsiveImages, stylesheet);

exports.images = responsiveImages;
exports.favicons = icons;

exports.css = stylesheet;

exports.art = artwork;
exports.default = art;

const distribute = gulp.series(jekyll('distribute'));
const start = gulp.series(jekyll('dev'));
