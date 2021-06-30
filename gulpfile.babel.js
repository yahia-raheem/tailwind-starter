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
import ignoreList from "./critical.safelist";
import tailwindcss from "tailwindcss";
import browser from "browser-sync";
import imagemin from "gulp-imagemin";
import sherpa from "style-sherpa";
import imageResize from "gulp-image-resize";
import rename from "gulp-rename";
import fs from "fs";
import yaml from "js-yaml";
import scrape from "website-scraper";
import flatten from "gulp-flatten";

const critical = require("critical").stream;

const PRODUCTION = yargs.argv.prod;
sass.compiler = require("sass");

// Load settings from settings.yml
const {
  SIZES,
  CRITICALSIZES,
  SCRAPPEREXTRACT,
  SCRAPPERLINK,
  GENIMAGESIZES,
  GENCRITICAL,
  BUILDBUNDLE,
  BROWSERSYNC
} = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync("config.yml", "utf8");
  return yaml.load(ymlFile);
}

export const extractHtml = (c) => {
  return scrape(
    {
      urls: [SCRAPPERLINK],
      directory: "dist/extracted",
      recursive: true,
      maxRecursiveDepth: 2,
      sources: [{}],
    },
    c
  );
};

export const styles = () => {
  return src(["src/scss/bundle.scss", "src/scss/bundle-rtl.scss"])
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass({ fiber: Fiber }).on("error", sass.logError))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest("dist/assets/css"));
};

export const postStyles = () => {
  return src(["dist/assets/css/bundle.css", "dist/assets/css/bundle-rtl.css"])
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
    .pipe(dest("dist/assets/css"));
};

export const stylePurge = () => {
  return src(["dist/assets/css/bundle.css", "dist/assets/css/bundle-rtl.css"])
    .pipe(
      gulpif(
        PRODUCTION,
        purgecss({
          content: [
            "dist/**/*.html",
            "dist/assets/js/**/*.js",
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
    .pipe(dest("dist/assets/css"));
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
    .pipe(dest("dist/assets/js"));
};

export const copy = () => {
  return src([
    "src/**/*",
    "!src/{images,js,scss,html,styleguide}",
    "!src/{images,js,scss,html,styleguide}/**/*",
  ]).pipe(dest("dist"));
};

export const html = () => {
  return src(["src/html/**/*.html", "!src/html/**/*.part.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulpif(PRODUCTION, flatten()))
    .pipe(dest("dist"));
};

export const htmlrtl = () => {
  return src(["dist/**/*.html", "!dist/styleguide.html", "!dist/**/*-rtl.html"])
    .pipe(replace("bundle.css", "bundle-rtl.css"))
    .pipe(replace("bundle.js", "bundle-rtl.js"))
    .pipe(replace('dir="ltr"', 'dir="rtl"'))
    .pipe(rename({ suffix: "-rtl" }))
    .pipe(dest("dist"));
};

export const fluffHtml = () => {
  return src(["dist/**/*.html", "!dist/styleguide.html"])
    .pipe(replace("/assets", "assets"))
    .pipe(dest("dist"));
};

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
    .pipe(dest("dist/assets/images"));
};

export const imagesGen = (cb) => {
  SIZES.forEach((size) => {
    src("src/images/**/*.{jpg,jpeg,png,svg,gif}")
      .pipe(imageResize({ width: size }))
      .pipe(
        rename(function (path) {
          path.basename = `${path.basename}@${size}w`;
        })
      )
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
      .pipe(dest("dist/assets/images"));
  });
  cb();
};

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
  return src(["dist/**/*.html", "!dist/styleguide.html", "!dist/**/*-rtl.html"])
    .pipe(
      critical({
        base: "dist/",
        inline: true,
        css: ["dist/assets/css/bundle.css"],
        dimensions: CRITICALSIZES,
        ignore: {
          rule: ignoreList.ignorePatterns,
        },
      })
    )
    .on("error", (err) => {
      console.log(err);
    })
    .pipe(dest("dist"));
};
export const genCriticalRtl = () => {
  return src(["dist/**/*-rtl.html"])
    .pipe(
      critical({
        base: "dist/",
        inline: true,
        css: ["dist/assets/css/bundle-rtl.css"],
        dimensions: CRITICALSIZES,
        ignore: {
          rule: ignoreList.ignorePatterns,
        },
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
      directory: BROWSERSYNC.directory,
      routes: {
        "/assets": "assets",
      },
    },
    tunnel: BROWSERSYNC.tunnel,
    port: 3000,
  });
  done();
};

export const reload = () => {
  return browser.reload();
};

export const clean = () => del(["dist"]);
export const extractClean = () => del(["dist/extracted"]);

export const compress = () => {
  return src([
    "**/*",
    "!node_modules{,/**}",
    "!bundled{,/**}",
    "!src{,/**}",
    "!.babelrc",
    "!config.yml",
    "!tailwind.config.js",
    "!README.md",
    "!.gitignore",
    "!gulpfile.babel.js",
    "!critical.safelist.js",
    "!LICENSE",
    "!.github{,/**}",
    "!CODE_OF_CONDUCT.md",
    "!purgecss.safelist.js",
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

const gulpTaskIf = (condition, task) => {
  task = series(task); // make sure we have a function that takes callback as first argument
  return (cb) => {
    if (condition()) {
      task(cb);
    } else {
      cb();
    }
  };
};

export const dev = series(
  clean,
  parallel(styles, copy, scripts),
  gulpTaskIf(() => GENIMAGESIZES, imagesGen),
  gulpTaskIf(() => !GENIMAGESIZES, images),
  html,
  htmlrtl,
  postStyles,
  styleGuide,
  server,
  watchForChanges
);
export const build = series(
  clean,
  gulpTaskIf(() => SCRAPPEREXTRACT, extractHtml),
  scripts,
  parallel(styles, copy),
  gulpTaskIf(() => GENIMAGESIZES, imagesGen),
  gulpTaskIf(() => !GENIMAGESIZES, images),
  html,
  htmlrtl,
  fluffHtml,
  postStyles,
  styleGuide,
  stylePurge,
  gulpTaskIf(() => GENCRITICAL, genCritical),
  gulpTaskIf(() => GENCRITICAL, genCriticalRtl),
  gulpTaskIf(() => SCRAPPEREXTRACT, extractClean),
  gulpTaskIf(() => BUILDBUNDLE, compress)
);
export default dev;
