/**
 * -----------------------------------------------------------------------------
 * 🧩 PLUGINS AND PATHS
 * -----------------------------------------------------------------------------
 */
// #region

// The last method: symlink
const { src, dest, watch, series, parallel, lastRun } = require('gulp');

const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const yargs = require('yargs').alias('p', 'production');

// Look for the --p flag
const PRODUCTION = !!yargs.argv.production;

// Paths
const root = {
  src: './src',
  dest: '.',
};

const paths = {
  css: {
    src: {
      main: `${root.src}/style.scss`,
    },
    watch: `${root.src}/**/*.scss`,
    tmp: `${root.src}/css`,
    dest: `${root.dest}/css`,
  },

  markup: {
    src: [
      `${root.src}/pages/**/*.pug`,
      `!${root.src}/pages/base/*.pug`,
      `!${root.src}/pages/notes/*.pug`,
      `!${root.src}/pages/outlines/*.pug`,
    ],
    watch: `${root.src}/**/*.pug`,
    dest: `${root.src}/pages`,
  },

  img: {
    src: {
      components: [
        `${root.src}/**/*.+(jpg|jpeg|png|svg|gif|webp)`,
        `!${root.src}/base/graphics/sprite/**/*`,
        `!${root.src}/img/**/*`,
      ],
      graphics: `${root.src}/img/**/*.+(jpg|jpeg|png|svg|gif|webp)`,
    },
    // Vars array in watchers breaks build process, so there is one var for a watcher
    watch: [
      `${root.src}/**/*.+(jpg|jpeg|png|svg|gif|webp)`,
      `!${root.src}/base/graphics/sprite/**/*`,
    ],
    dest: `${root.dest}/images/socmedical`,
  },

  js: {
    src: {
      main: `${root.src}/main.js`,
    },
    watch: [`${root.src}/**/*.js`],
    dest: `${root.dest}/js/socmedical`,
  },

  sprite: {
    src: {
      main: [
        `${root.src}/base/graphics/sprite/*.svg`,
        `!${root.src}/base/graphics/sprite/icon-flag-*.svg`,
      ],
      flags: `${root.src}/base/graphics/sprite/icon-flag-*.svg`,
    },
    dest: `${root.src}/base/graphics`,
  },
};
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🎨 STYLES
 * -----------------------------------------------------------------------------
 */
// #region

const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
// const cssnano = require('gulp-cssnano');
const cleanCSS = require('gulp-clean-css');
// const postcss = require('gulp-postcss');
// const uncss = require('postcss-uncss');

// COMMON STYLES FUNCTION
const cssTasks = (
  source,
  subtitle,
  uncssHTML,
  destination
  /* , link = true */
) =>
  src(source)
    .pipe(changed(destination))
    .pipe(plumber())
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(
      sass({
        precision: 4,
        includePaths: ['.'],
      }).on('error', sass.logError)
    )
    // autoprefixer (browserslist) has been set in package.json
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest(paths.css.tmp))
    // .pipe(
    //   gulpif(
    //     PRODUCTION,
    //     gulpif(
    //       link,
    //       postcss([
    //         uncss({
    //           html: uncssHTML,
    //           ignore: [
    //             /* eslint-disable max-len */
    //             // Bootstrap
    //             /\w\.fade/,
    //             /\.collapse?(ing)?/,
    //             /\.carousel(-[a-zA-Z]+)?/,
    //             /\.modal(-[a-zA-Z]+)?/,

    //             // Custom
    //             /\.header:not\(.page.is-home\ .header\)/,
    //             /\.[mp][btlrx]-(((sm|md|mdl|lg|xl|xxl)-)*?)[0-9s]+/,
    //             /\.form__control\.is-textarea\.is-touched/,
    //             /\.form__control\.is-touched/,
    //             /\.mx-(.*?)auto+/,
    //             /\.vk/,
    //             /\w\.(has-been-validated|has-spinner|is-active|is-on|is-open|is-pressed|is-touched)/,
    //             /iframe/,
    //             /* eslint-enable max-len */
    //           ],
    //         }),
    //       ])
    //     )
    //   )
    // )
    // .pipe(gulpif(PRODUCTION, cleanCSS({ format: 'beautify' })))
    .pipe(gulpif(PRODUCTION, cleanCSS()))
    .pipe(size({ title: `styles: ${subtitle}` }))
    .pipe(dest(destination))
    .pipe(browserSync.stream());

// MAIN
function css(done) {
  cssTasks(
    paths.css.src.main, // src
    'main', // subtitle
    // uncssHTML; use array syntax for normal results
    [`${root.src}/pages/uncss/**/*.html`],
    `${paths.css.dest}/socmedical`
  );
  done();
}

// Core CSS
function copyCoreCss() {
  return src(`${root.src}/css/core/**/*.css`).pipe(
    dest(`${paths.css.dest}/core`)
  );
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📰 MARKUP
 * -----------------------------------------------------------------------------
 */
// #region

// PUG
const pug = require('gulp-pug');

function buildPug(done) {
  src(paths.markup.src)
    .pipe(plumber())
    .pipe(
      pug({
        doctype: 'html',
        pretty: true,
        basedir: root.src,
      })
    )
    .pipe(dest(paths.markup.dest))
    .pipe(browserSync.stream());
  done();
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🖼 IMAGES
 * -----------------------------------------------------------------------------
 */
// #region

const imagemin = require('gulp-imagemin');
const imageminGIF = require('imagemin-gifsicle');
const imageminJPG = require('imagemin-mozjpeg');
const imageminPNG = require('imagemin-pngquant');
const imageminSVG = require('imagemin-svgo');

// Common images function
const imgTasks = (source, subtitle, destination) =>
  src(source, { since: lastRun(imgTasks) })
    .pipe(changed(paths.img.dest))
    .pipe(
      imagemin(
        [
          imageminGIF({
            interlaced: true,
            optimizationLevel: 3,
          }),
          imageminJPG({ quality: 85 }),
          imageminPNG([0.8, 0.9]),
          imageminSVG({
            plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(destination))
    .pipe(browserSync.stream())
    .pipe(size({ title: `images: ${subtitle}` }));

// Components
function imgComponents(done) {
  imgTasks(
    paths.img.src.components, // src
    'components', // subtitle
    paths.img.dest // dest
  );
  done();
}

// Graphics
function imgGraphics(done) {
  imgTasks(
    paths.img.src.graphics, // src
    'graphics', // subtitle
    paths.img.dest
  );
  done();
}

// OPTIMIZE
const img = parallel(imgComponents, imgGraphics);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * ❤️ SVG SPRITE
 * -----------------------------------------------------------------------------
 */
// #region

const svgSprite = require('gulp-svg-sprite');

const svgTasks = (source, name, destination) => {
  return src(source)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: '.', // Output in the same directory
            sprite: name, // Sprite path and name
            prefix: '.', // Prefix for CSS selectors
            dimensions: '', // Suffix for dimension CSS selectors
          },
        },
        svg: {
          xmlDeclaration: false, // strip out the XML attribute
          doctypeDeclaration: false, // don't include the !DOCTYPE declaration
          namespaceClassnames: false, // keep the source class names untouched
        },
      })
    )
    .pipe(dest(destination));
};

function spriteMain(done) {
  svgTasks(
    paths.sprite.src.main, // src
    'sprite.svg', // sprite name
    paths.sprite.dest // dest
  );
  done();
}

function spriteFlags(done) {
  svgTasks(
    paths.sprite.src.flags, // src
    'flags.svg', // sprite name
    paths.sprite.dest // dest
  );
  done();
}

const sprite = series(spriteMain, spriteFlags, parallel(css, imgComponents));
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 💾 SCRIPTS
 * -----------------------------------------------------------------------------
 */
// #region
const webpack = require('webpack-stream');

function scripts() {
  return src(paths.js.src.main)
    .pipe(changed(paths.js.dest))
    .pipe(plumber())
    .pipe(
      webpack({
        mode: 'production',
        entry: paths.js.src.main,
        output: {
          filename: '[name].js',
          library: 'socmedical',
        },
      })
    )
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🛠 UTILITIES
 * -----------------------------------------------------------------------------
 */
// #region

// CLEAN
const del = require('del');

// Assets
function cleanAssets() {
  return del([
    `${paths.css.dest}/**/*.css`,
    `!${paths.css.dest}/**/bootstrap.css`,
    // `${root.dest}_includes/critical.css`,
    `${paths.js.dest}/**/*`,
    `${paths.img.dest}/**/*`,
  ]);
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 📶 SERVER
 * -----------------------------------------------------------------------------
 */
// #region

// const { reload } = browserSync;

function watchFiles() {
  watch(paths.css.watch, series(css));
  watch(paths.js.watch, series(scripts));
  watch(paths.img.watch).on('change', series(img));
  watch(paths.markup.watch, series(buildPug));
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: root.dest,
    },
    middleware(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    },
    port: 9000,
    notify: false,
  });
  copyCoreCss();
  watchFiles();
  done();
}
// #endregion

/**
 * -----------------------------------------------------------------------------
 * 🏗 BUILD / DEFAULT
 * -----------------------------------------------------------------------------
 */
// #region

const build = series(
  cleanAssets,
  copyCoreCss,
  sprite,
  buildPug,
  img,
  parallel(css, scripts)
);
// #endregion

/**
 * -----------------------------------------------------------------------------
 * ☑️ TASKS
 * -----------------------------------------------------------------------------
 */

/* eslint-disable no-multi-spaces */

exports.copycss = copyCoreCss;
exports.clean = cleanAssets;
exports.sprite = sprite;
exports.img = img;
exports.js = scripts;
exports.css = css;
exports.pug = buildPug;
exports.w = watchFiles;
exports.s = serve;
exports.default = build;
