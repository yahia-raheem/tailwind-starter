/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/bundle.js":
/*!**************************!*\
  !*** ./src/js/bundle.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_sidebar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/sidebar */ "./src/js/components/sidebar.js");
/* harmony import */ var _components_sidebar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_components_sidebar__WEBPACK_IMPORTED_MODULE_0__);
// import "./components/bootstrap-imports";
// import "./components/my-navbar";
// import "./components/navigator";
// import "./components/helpers";
 // import './components/shared';

document.addEventListener("DOMContentLoaded", function () {});

/***/ }),

/***/ "./src/js/components/sidebar.js":
/*!**************************************!*\
  !*** ./src/js/components/sidebar.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var isOpen = false;
var sideBar = document.getElementById("mySidenav");
document.addEventListener("DOMContentLoaded", function () {
  var togglebtn = document.querySelector(".navbar-toggler");
  var closebtn = document.querySelector(".closebtn");
  var sidemenuItems = document.querySelectorAll(".mobile-menu .menu-item");
  sidemenuItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.stopPropagation();

      if (item.classList.contains("menu-item-has-children")) {
        var submenu = item.querySelector(".sub-menu");
        var itemsNum = item.querySelectorAll(".menu-item").length;

        if (submenu.classList.contains("opened")) {
          item.classList.remove('child-menu-opened');
          submenu.classList.remove("opened");
          submenu.style.maxHeight = 0;
        } else {
          item.classList.add('child-menu-opened');
          submenu.classList.add("opened");
          submenu.style.maxHeight = "".concat(itemsNum * 64, "px");
        }
      }
    });
  });
  togglebtn.addEventListener("click", function () {
    openNav();
    document.addEventListener("click", outsideClickListener);
    setTimeout(function () {
      isOpen = true;
    }, 1000);
  });
  closebtn.addEventListener("click", function () {
    closeNav();
  });
});

var openNav = function openNav() {
  sideBar.style.width = "100vw";
};

var closeNav = function closeNav() {
  sideBar.style.width = "0";
  isOpen = false;
  removeClickListener();
};

var outsideClickListener = function outsideClickListener(event) {
  if (!sideBar.contains(event.target) && isOpen) {
    closeNav();
  }
};

var removeClickListener = function removeClickListener() {
  document.removeEventListener("click", outsideClickListener);
};

/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./src/js/bundle.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /media/yahia/yahia/work/tailwind-starter/src/js/bundle.js */"./src/js/bundle.js");


/***/ })

/******/ });