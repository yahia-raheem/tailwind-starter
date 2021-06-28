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
import purgecss from "gulp-purgecss";
import safelist from "./purgecss.safelist";
import tailwindcss from "tailwindcss";
import browser from "browser-sync";
import imagemin from "gulp-imagemin";
import sherpa from "style-sherpa";
import imageResize from "gulp-image-resize";
import rename from "gulp-rename";
import fs from "fs";
import yaml from "js-yaml";

const critical = require("critical").stream;

const PRODUCTION = yargs.argv.prod;
sass.compiler = require("sass");

// Load settings from settings.yml
const { SIZES, CRITICALSIZES } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync("config.yml", "utf8");
  return yaml.load(ymlFile);
}

export const styles = () => {
  return src(["src/scss/bundle.scss", "src/scss/bundle-rtl.scss"])
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass({ fiber: Fiber }).on("error", sass.logError))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest("dist/css"));
};

export const postStyles = () => {
  return src(["dist/css/bundle.css", "dist/css/bundle-rtl.css"])
    .pipe(gulpif(!PRODUCTION, sourcemaps.init({ loadMaps: true })))
    .pipe(
      gulpif(
        !PRODUCTION,
        postcss([tailwindcss()]).on("error", (err) => console.log(err))
      )
    )
    .pipe(gulpif(PRODUCTION, cleanCss({ level: 0 })))
    .pipe(
      gulpif(
        PRODUCTION,
        postcss([tailwindcss(), cssnano({ preset: "advanced" })])
      )
    )
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest("dist/css"));
};

export const stylePurge = () => {
  return src(["dist/css/bundle.css", "dist/css/bundle-rtl.css"])
    .pipe(
      gulpif(
        PRODUCTION,
        purgecss({
          content: [
            "dist/**/*.html",
            "dist/js/**/*.js",
            "!dist/styleguide.html",
          ],
          defaultExtractor: (content) =>
            content.match(/[\w-/:\[\]\%]+(?<!:)/g) || [],
          safelist: {
            standard: [...safelist.whitelist],
            deep: [...safelist.whitelistPatterns],
          },
        })
      )
    )
    .pipe(dest("dist/css"));
};

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
        externals: {},
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
    .pipe(dest("dist"));
};

export const htmlrtl = () => {
  return src(["dist/*.html", "!dist/styleguide.html", "!dist/*-rtl.html"])
  .pipe(replace('bundle.css', 'bundle-rtl.css'))
  .pipe(replace('bundle.js', 'bundle-rtl.js'))
  .pipe(rename({suffix: "-rtl"}))
  .pipe(dest("dist"))
}

export const images = () => {
  return src("src/images/**/*.{jpg,jpeg,png,svg,gif}")
    .pipe(
      gulpif(
        PRODUCTION,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
    )
    .pipe(dest("dist/images"));
};

// export const images = (cb) => {
//   SIZES.forEach((size) => {
//     src("src/images/**/*.{jpg,jpeg,png,svg,gif}")
//       .pipe(imageResize({ width: size }))
//       .pipe(
//         rename(function (path) {
//           path.basename = `${path.basename}@${size}w`;
//         })
//       )
//       .pipe(
//         gulpif(
//           PRODUCTION,
//           imagemin([
//             imagemin.gifsicle({ interlaced: true }),
//             imagemin.mozjpeg({ quality: 75, progressive: true }),
//             imagemin.optipng({ optimizationLevel: 5 }),
//             imagemin.svgo({
//               plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
//             }),
//           ])
//         )
//       )
//       .pipe(dest("dist/images"));
//   });
//   cb();
// };

export const styleGuide = (done) => {
  sherpa(
    "./src/styleguide/index.md",
    {
      output: "./dist/styleguide.html",
      template: "./src/styleguide/template.hbs",
    },
    done
  );
};

export const genCritical = (cb) => {
  return src(["dist/*.html", "!dist/styleguide.html", "!dist/*-rtl.html"])
    .pipe(
      critical({
        base: "dist/",
        inline: true,
        css: ["dist/css/bundle.css"],
        dimensions: CRITICALSIZES,
      })
    )
    .on("error", (err) => {
      console.log(err);
    })
    .pipe(dest("dist"));
};
export const genCriticalRtl = () => {
  return src(["dist/*-rtl.html"])
    .pipe(
      critical({
        base: "dist/",
        inline: true,
        css: ["dist/css/bundle-rtl.css"],
        dimensions: CRITICALSIZES,
      })
    )
    .on("error", (err) => {
      console.log(err);
    })
    .pipe(dest("dist"));
};

export const server = (done) => {
  browser.init({
    server: {
      baseDir: "dist",
      directory: true,
    },
    port: 3000,
  });
  done();
};

export const reload = () => {
  return browser.reload();
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
  watch("src/scss/**/*.scss").on("all", series(styles, postStyles, reload));
  watch(["src/**/*", "!src/{images,js,scss}", "!src/{images,js,scss}/**/*"]).on(
    "all",
    series(copy, reload)
  );
  watch("src/js/**/*.js").on(
    "all",
    series(scripts, styles, postStyles, reload)
  );
  watch("./src/html/**/*.html").on(
    "all",
    series(html, htmlrtl, styles, postStyles, reload)
  );
  watch("src/images/**/*.{jpg,jpeg,png,svg,gif}").on(
    "all",
    series(images, reload)
  );
  watch("src/styleguide/**").on("all", series(styleGuide, reload));
};

export const dev = series(
  clean,
  parallel(styles, copy, scripts, images),
  html,
  htmlrtl,
  postStyles,
  styleGuide,
  server,
  watchForChanges
);
export const build = series(
  clean,
  scripts,
  parallel(styles, copy, images),
  html,
  htmlrtl,
  postStyles,
  styleGuide,
  stylePurge,
  genCritical,
  genCriticalRtl,
  compress
);
export default dev;
