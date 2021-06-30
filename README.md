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
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

This is my starting point for front end development. usually i find some of these features in another starter template. but never all of them at the same time. so i decided to make my own starter template and everyone is welcome to request features or contribute to it in any way he likes.

Current features:

- rtl support
- dart-sass support
- tree-shaking
- auto-prefixing
- sass mixins, and ES6 helper functions for various tasks such as triggereing callback functions on intersection observer events, and keeping aspect ratio dynamically, and more.
- basic navbar and sidebar with dropdown support
- image optimization (tweeking can be done from the gulp file)
- styleguide generation
- es6 to es5 for older browsers support
- working jit implementation (tailwind jit)
- responsive image generation (using gulp-image-resize. check their website for installation instructions and the steps section for how to use it)
- generate and inline critical css for both rtl and ltr with viewport control

### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

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

4. run the following command for production (you'll find a bundle with the necissary files in the bundled folder or you could delete it and the node_modules folders if you'd like to keep the src folder in production)

```sh
npm run build
```

5. running `npm start` will open a window with the directory structure of the dist folder just click on the file you want to view

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

<!-- USAGE EXAMPLES -->

## Usage

aside from integrating tailwind, this repo also includes some of my favourite css classes and js functions to make my life easier. so please do check them out. and someday i'll try to document them properly but for now take a look at the notes below for some general notes and specific use cases.

- if you want to use the responsive image generator make sure you follow the `imagemagic` and `graphicsmagic` packages installation instructions from the `gulp-image-resize` page

- tailwind debug screens is installed (adds small text to the bottom left corner of the screen with the current breakpoint) to use it add the `debug-screens` class to the body tag. don't forget to remove it before production

- when to use the website-scrapper task ? well if, for example, you have a wordpress installation and some of your styles are styling plugins installed outside of your theme then how can you treeshake your project without access to their html ? what you have to do in this case is add your local development project's link in the SCRAPPERLINK variable in `config.yml` and set `SCRAPPEREXTRACT: true`. this will then extract the html from your local server and store it within the dist folder for the treeshaking function to find. and don't worry the extracted html is deleted automatically so you don't even have to see it.

- you can add regexp. to the critical.safelist.js to ignore them when generating critical css. the same goes for purgecss.safelist.js to avoid removing those classes when purging styles (maybe the html gets injected later or they keep getting removed for no apparent reason)

- when working in an html file and you want to link to an image or css file or js file that also exists within the src folder then prefix it with `/assets`

  - example: you want to add the `src/scss/bundle.css` file to the head .. you'd do it like this `src="/assets/css/bundle.css"` (note the leading slash). so what happened here ? first of all ofcourse the scss files is compiled to css, hence the `/css/` part .. but i wanted to allow people to add folders to the html and route to them automatically if they want

  ```yml
  html:
    - index.html
    - about.html
    - services.html
    - services
      - service-single.html
  ```

  normally you can't work with the above example because service-single.html can't have the same header and footer as the rest (since it is not on the same level as `index.html` for example so all of its imports have to go one level up `../css/bundle.css` for example) but i wanted people to be able to create nested routes if they want .. so i resolve the import of `/assets` to the assets folder (from browser-sync). so then no matter where you are in the src folder you can always import any asset (css, js, image) by prefixing the import with `/assets`. also i remove the leading slash in production and i flatten all the html files in the src direectory to avoid import issues (which means you have to keep all of the file names unique so that they won't get overwritten)

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
