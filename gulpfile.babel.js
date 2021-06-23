import { src, dest, watch, series, parallel } from "gulp";
import yargs from "yargs";
import sass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import gulpif from "gulp-if";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import del from "del";
import webpack from "webpack-stream";
import named from "vinyl-named";
import zip from "gulp-zip";
import info from "./package.json";
import fileinclude from "gulp-file-include";
import replace from "gulp-replace";
import cssnano from "cssnano";
import Fiber from "fibers";
import purgecss from 'gulp-purgecss';
import safelist from './purgecss.safelist'
import tailwindcss from 'tailwindcss'


const PRODUCTION = yargs.argv.prod;
sass.compiler = require('sass');

export const styles = () => {
  return src(["src/scss/bundle.scss", "src/scss/bundle-rtl.scss"])
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass({ fiber: Fiber }).on("error", sass.logError))
    .pipe(gulpif(PRODUCTION, cleanCss({ level: 0 })))
    .pipe(gulpif(!PRODUCTION, postcss([tailwindcss()])))
    .pipe(gulpif(PRODUCTION, postcss([tailwindcss(), cssnano({ preset: 'advanced' })])))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest("dist/css"));
};

export const stylePurge = () => {
  return src(['dist/css/bundle.css', 'dist/css/bundle-rtl.css'])
    .pipe(gulpif(PRODUCTION, purgecss({
      content: ['dist/html/**/*.html', 'dist/js/**/*.js'],
      safelist: {
        standard: [...safelist.whitelist],
        deep: [...safelist.whitelistPatterns]
      }
    })))
    .pipe(dest("dist/css"))
}

export const scripts = () => {
  return src(["src/js/bundle.js", "src/js/bundle-rtl.js"])
    .pipe(named())
    .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
        mode: PRODUCTION ? "production" : "development",
        devtool: false,
        output: {
          filename: "[name].js",
        },
        externals: {
          jquery: 'jQuery',
        },
      })
    )
    .pipe(dest("dist/js"));
};

export const copy = () => {
  return src([
    "src/**/*",
    "!src/{images,js,scss,html}",
    "!src/{images,js,scss,html}/**/*",
  ]).pipe(dest("dist"));
};

export const html = () => {
  return src(["src/html/*.html", "!src/html/*.part.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("dist/html"));
};

export const clean = () => del(["dist"]);

export const compress = () => {
  return src([
    "**/*",
    "!node_modules{,/**}",
    "!bundled{,/**}",
    "!src{,/**}",
    "!.babelrc",
    "!.gitignore",
    "!gulpfile.babel.js",
    "!package.json",
    "!package-lock.json",
  ])
    .pipe(
      gulpif(
        (file) => file.relative.split(".").pop() !== "zip",
        replace("_themename", info.name)
      )
    )
    .pipe(zip(`${info.name}-${info.version}.zip`))
    .pipe(dest("bundled"));
};

export const watchForChanges = () => {
  watch("src/scss/**/*.scss", styles);
  watch(
    ["src/**/*", "!src/{images,js,scss}", "!src/{images,js,scss}/**/*"],
    copy
  );
  watch("src/js/**/*.js", scripts);
  watch("./src/html/**/*.html", html);
};

export const dev = series(
  clean,
  parallel(styles, copy, scripts),
  html,
  watchForChanges
);
export const build = series(
  clean,
  scripts,
  parallel(styles, copy),
  html,
  stylePurge,
  compress
);
export default dev;
