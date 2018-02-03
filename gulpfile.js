var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var paths = {
  styles: {
    src: 'src/style/**/*.scss',
    dist: 'dist/assets/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dist: 'dist/assets/js/'
  },
  images: {
    src: 'src/img/**/*.{jpg,jpeg,png,gif}',
    dist: 'dist/assets/img/'
  },
  pages: {
    src: 'src/pages/**/*.html',
    dist: 'dist/pages/'
  },
  font: {
    tpl: 'src/fonts/template/fonts.scss',
    src: 'src/fonts/svg/**.svg',
    dist: 'dist/assets/css/fonts',
  }
}


function clean() {
  return del(['dist']);
}

function pages() {
  return gulp.src(paths.pages.src)
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.pages.dist))
    .pipe(reload({
      stream: true
    }));
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass()).on('error', plugins.sass.logError)
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(plugins.filter('**/*.css'))
    .pipe(reload({
      stream: true
    }));
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(reload({
      stream: true
    }));
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(plugins.imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.images.dist))
    .pipe(reload({
      stream: true
    }));
}

function fonts() {
  return gulp.src([paths.font.src])
    .pipe(plugins.iconfontCss({
      fontName: 'icon',
      path: paths.font.tpl,
      targetPath: '../../../../src/scss/module/fonts.scss',
      fontPath: './fonts/'
    }))
    .pipe(plugins.iconfont({
      fontName: 'icon',
      fontHeight: 1024,
      prependUnicode: true,
      normalize: true,
      formats: ['ttf', 'eot', 'woff', 'svg']
    }))
    .pipe(gulp.dest(paths.font.dist));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './dist',
      index: '/pages/index.html'
    },
    notify: false
  });

  gulp.watch(paths.pages.src, pages);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
}

var build = gulp.series(
  clean, 
  fonts,
  gulp.parallel(
    pages,
    styles,
    scripts,
    images
  )
);

gulp.task('clean', clean);
gulp.task('pages', pages);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('images', images);
gulp.task('iconfont', fonts);
gulp.task('watch', gulp.series(build, watch));
gulp.task('build', build);

