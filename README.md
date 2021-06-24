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

planned features:
1) a complete UI library with html component files + mixins to allow for quick changes to elements
2) compiling to an spa-like configuration for a quick static deployment (for proof of concepts or similar usage)

steps:
1) download a release
2) run npm install
3) run npm start for the dev environment
4) when you're done run npm run build
5) you'll find the pure theme within the bundled folder or you could just delete the node_modules and the bundled folders if you'd rather keep your src files intact
