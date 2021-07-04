# My Tailwind Starter

<!-- PROJECT LOGO -->
<br />
<p align="center">
    <h3 align="center">My starter template</h3>
    <p align="center">
        Based on Tailwind and Gulp
        <br />
        <br />
        �
        <a href="https://github.com/yahia-raheem/tailwind-starter/issues">Report Bug</a>
        �
        <a href="https://github.com/yahia-raheem/tailwind-starter/issues">Request Feature</a>
    </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Helpers](#helpers)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

This is my starting point for front end development. usually i find some of these features in another starter template. but never all of them at the same time. so i decided to make my own starter template and everyone is welcome to request features or contribute to it in any way he/she likes.

Current features:

- rtl support
- dart-sass support
- tree-shaking
- auto-prefixing
- postcss optimizations
- html minification
- sass mixins, and ES6 helper functions for various tasks such as triggereing callback functions on intersection observer events, and keeping aspect ratio dynamically, and more.
- basic navbar and sidebar with dropdown support
- image optimization (tweeking can be done from the gulp file)
- styleguide generation
- es6 to es5 for older browsers support
- working jit implementation (tailwind jit)
- responsive image generation (using gulp-image-resize. check their website for installation instructions and the steps section for how to use it)
- generate and inline critical css for both rtl and ltr with viewport control
- dynamic routing in development mode (more in the usage section)

### Built With

- [Gulp](https://gulpjs.com/)
- [Tailwind](https://tailwindcss.com/)

<!-- GETTING STARTED -->

## Getting Started

This is a simple starter template you'll find it hard to be confused about it but here goes.

### Prerequisites

Below is the mighty list of all the prequisits that are needed to run my template .. please make sure to install all of them :smile:

- npm

```sh
npm install npm@latest -g
```

### Installation

1. Download a release from releases .. or you know clone master if danger is your middle name
2. Install NPM packages

```sh
npm install
```

3. run the following command for development

```sh
npm start
```

4. run the following command for production

```sh
npm run build
```

## Configuration

Within the config.yml file you'll find some configurable defaults. below are what they do.

- SIZES: these are the sizes of the generated images if your using the image resize task (more on that below). you can add or remove sizes as you see fit.

- CRITICALSIZES: the viewport width and height pairs which are used to generate, and inline, critical css. make sure to add both width and height and in a format similar to the example viewports in the yml file

- SCRAPPEREXTRACT: possible values are `True` and `False`. if set to true a webscrapper is used to crawl a link (and all sub links up to 2 levels deep) and the extracted html is then added to a folder called extracted within the dist folder. this then is used in the purgecss task to treeshake the css. (find use cases in the usage section)

- SCRAPPERLINK: the scrapper link used for the scrapping function

- GENIMAGESIZES: possible values are `True` and `False`. this function generates images with different sizes from a source image. the resulted images are then suffixed with `@[size]w` where size is every size in the SIZES array. you can then add srcset to images to allow for serving different images at different viewport widths. please make sure to install all the prequisit packages neede for this function to work (thses are OS level prequisits so i can't inlcude them in my package.json), find out more about these prequisits in the usage section

- GENCRITICAL: possible values are `True` and `False`. whether to generate critical css or not (i found that in 99% of the times critical css is benefitial but you can disable it for that 1% if you want)

- BUILDBUNDLE: builds an output theme that can be given to clients (aka: no src files, no gulp or gulp related files, and no package.json or anything similar) if you'd like to not submit your src project

- BROWSERSYNC: contains two options: `tunnel`: possible values are `True` and `False`. it exposes your local dedvelopment environment to the internet (maybe your team leader wants to view the project on his phone right now ... we've all been there). the other option is `directory`: possible values are `True` and `False`. it makes the server open a file browser within the dist folder so that you can select the file you want to view. if set to false then the server will look for an `index.html` file to open instead
- MINIFYHTMLOPTIONS: all options passed to this config point are passed to gulp-htmlmin which in turn is passed to html-minifier. see this [link](https://github.com/kangax/html-minifier) for the available options.

<!-- USAGE EXAMPLES -->

## Usage

aside from integrating tailwind, this repo also includes some of my favourite css classes and js functions to make my life easier. so please do check them out. and someday i'll try to document them properly but for now take a look at the notes below for some general notes and specific use cases.

- if you want to use the responsive image generator make sure you follow the `imagemagic` and `graphicsmagic` packages installation instructions from the `gulp-image-resize` page

- when to use the website-scrapper task ? well if, for example, you have a wordpress installation and some of your styles are styling plugins installed outside of your theme then how can you treeshake your project without access to their html ? what you have to do in this case is add your local development project's link in the SCRAPPERLINK variable in `config.yml` and set `SCRAPPEREXTRACT: true`. this will then extract the html from your local server and store it within the dist folder for the treeshaking function to find. and don't worry the extracted html is deleted automatically so you don't even have to see it.

- you can add regexp. to the critical.safelist.js to ignore them when generating critical css. the same goes for purgecss.safelist.js to avoid removing those classes when purging styles (maybe the html gets injected later or they keep getting removed for no apparent reason)

- you can link to assets (css, js, images) by prefixing the import with `/assets/` (notice the leading slash). the import then is resolved automatically no matter how deep your html file lives. also the leading slash is removed in production

- basic support for nested routing as follows. you can create as many folders within the `src/html` folder as you like, and as long as the folder contains a file not prefixed with `[filename].part.html` then it will be copied to the dist folder to allow for a nested routing behaviour out of the box .. for example if youu create a folder called services within `src/html` and within the folder created a file called `single-service.html` then the following route is resolved to this file `[domain]/services/single-service.html`. this behaviour is removed however in production and all html files will be flattened. which means that you have to keep your html file names unique. so for my previous example, in production you'll find the file `single-service.html` at dist root directly.

- if you want to use a mixin from the mixins file in the helpers folder just prefix it with `h.` by default (change this prefix from the entry file if you like). this is usefull to provide a scope for you so that if you want to add your own scss mixins from a file you don't have to worry about duplicate names

- take a look inside the html index file to get to know the way gulp file include works ... you can import files and use variables within these partials.
  - the gulp html scripts ignore all html files ending in the following prefix `[name].part.html` so you can use that to create as many partials as you want and won't have to worry about cluttering your dist folder.

<!-- HELPERS -->

## Helpers

this section is not complete and i'll try to dump as much time as i can in it in the future but feel free to explore the helpers folder within `src/scss` and the helpers js file within the `src/js/components` folder

- Images:

  - `img-container` class is a good image wrapper which pairs with some of the other functions in order for them to work.
  - `bg-image` class: paired with `img-container` makes the image take the entirety of the wrapping box. this works well if you want to apply aspect ratio to images or add background images to divs (make sure to add `relative` class to the image wrapping element unless it's img-container)

- Aspect Ratio:

  - `box-ratio` mixin: use it like so (where `width` and `height` are numbers like `box-ratio(16,9)` for ex).

  ```scss
  @include h.box-ratio(width, height);
  ```

  - `aspectRatioHelper` es function: if you don't want to use the padding trick for aspect ratio you can use this function to determine the elements aspect ratio on the fly. use it like so. (data-aspectRatio="width/height")

  ```js
  // src/js/bundle.js
  import { aspectRatioHelper } from "./components/helpers";

  document.addEventListener("DOMContentLoaded", () => {
    aspectRatioHelperelper();
    ...
  });
  ```
  ```html
  <div data-aspectRatio="16/9">
  ```
- Magnification: adds a magnifier glass to images (based on the w3schools example )
  - add the js helper, scss mixin, and html attribute that you'll find below. the scss mixin takes a `$size`(`100px` by default), and `$shape` (`'circle'` by default .. any other value makes it a square for now).
  ```js
  // src/js/bundle.js
  import { magnifyImages } from "./components/helpers";

  document.addEventListener("DOMContentLoaded", () => {
    magnifyImages();
    ...
  });
  ```
  ```html
<div class="img-container">
  <img src="/assets/images/.." data-magnify>
</div>
  ```
  ```scss
  @include h.magnifier($size, $shape);
  ```
#TODO

<!-- ROADMAP -->

## Roadmap

See the [open issues](tailwind-starter/issues) for a list of proposed features (and known issues).

<!-- LICENSE -->

## License

Distributed under the ISC License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Yahia Raheem - eng.yahiaraheem.93@outlook.com

Project Link: [https://github.com/yahia-raheem/tailwind-starter/](https://github.com/yahia-raheem/tailwind-starter/)
