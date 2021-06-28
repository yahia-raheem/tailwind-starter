# My Tailwind Starter
this is my gulp + tailwind starter theme with rtl support.

features:
1) rtl support
2) dart-sass support
3) tree-shaking
4) auto-prefixing
5) sass mixins, and ES6 helper functions for various tasks such as triggereing callback functions on intersection observer events, and keeping aspect ratio dynamically, and more.
6) basic navbar and sidebar with dropdown support
7) image optimization (tweeking can be done from the gulp file)
8) styleguide generation
9) es6 to es5 for older browsers support
10) working jit implementation (tailwind jit)
11) responsive image generation (using gulp-image-resize. check their website for installation instructions and the steps section for how to use it)

planned features:
1) a complete UI library with html component files + mixins to allow for quick changes to elements
2) compiling to an spa-like configuration for a quick static deployment (for proof of concepts or similar usage)

steps:
1) download a release
2) run `npm install`
3) run `npm start` for the dev environment
4) when you're done run `npm run build`
5) you'll find the pure theme within the bundled folder or you could just delete the node_modules and the bundled folders if you'd rather keep your src files intact.

notes:
1) if you want to use the responsive image generator make sure you follow the imagemagic and graphicsmagic packages installation instructions from the gulp-image-resize page and uncomment the commented image task in the gulp file while commenting the default one.
2) tailwind debug screens is installed (adds small text to the bottom left corner of the screen with the current breakpoint) to use it add the `debug-screens` class to the body tag. don't forget to remove it before production
3) css critical inline generates copies of the html files within the dist folder to `dist/critical/[dir]` (ltr or rtl) with the inlined css and the necissary modifications. it would have been better if it just adds the critical css to the html files at the root of the dist folder but that would've broken the rtl functionality. (if any one have any better ideas please let me know) that also means that, due to the structure of the dist folder, the bundle css, and js, within the html files within the critical folder have the wrong import paths, i will try another implementation soon that could solve most of these problems
4) yyou can configure the viewports that yyou want the critical css task to generate the critical css for within the config,yml file
