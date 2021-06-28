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

* [About the Project](#about-the-project)
    * [Built With](#built-with)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

This is my starting point for front end development. usually i find some of these features in another starter template. but never all of them at the same time. so i decided to make my own starter template and everyone is welcome to request features or contribute to it in any way he likes.

Current features:
* rtl support
* dart-sass support
* tree-shaking
* auto-prefixing
* sass mixins, and ES6 helper functions for various tasks such as triggereing callback functions on intersection observer events, and keeping aspect ratio dynamically, and more.
* basic navbar and sidebar with dropdown support
* image optimization (tweeking can be done from the gulp file)
* styleguide generation
* es6 to es5 for older browsers support
* working jit implementation (tailwind jit)
* responsive image generation (using gulp-image-resize. check their website for installation instructions and the steps section for how to use it)
* generate and inline critical css for both rtl and ltr with viewport control

### Built With
This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [Gulp](https://gulpjs.com/)
* [Tailwind](https://tailwindcss.com/)



<!-- GETTING STARTED -->
## Getting Started

This is a simple starter template you'll find it hard to be confused about it but here goes.

### Prerequisites

Below is the mighty list of all the prequisits that are needed to run my template .. please make sure to install all of them :smile:
* npm
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
5. running `npm run start` will open a window with the directory structure of the dist folder just click on the file you want to view



<!-- USAGE EXAMPLES -->
## Usage

aside from integrating tailwind, this repo also includes some of my favourite css classes and js functions to make my life easier. so please do check them out. and someday i'll try to document them properly but for now take a look at the notes below for some of the tweakable elements and useful mixins

Notes:
* if you want to use the responsive image generator make sure you follow the `imagemagic` and `graphicsmagic` packages installation instructions from the `gulp-image-resize` page and uncomment the commented image task in the gulp file while commenting the default one.
* tailwind debug screens is installed (adds small text to the bottom left corner of the screen with the current breakpoint) to use it add the `debug-screens` class to the body tag. don't forget to remove it before production
* you can configure the viewports that you want the critical css task to generate css for within the config.yml file



<!-- ROADMAP -->
## Roadmap

See the [open issues](tailwind-starter/issues) for a list of proposed features (and known issues).


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Yahia Raheem - eng.yahiaraheem.93@outlook.com

Project Link: [https://github.com/yahia-raheem/tailwind-starter/](https://github.com/yahia-raheem/tailwind-starter/)