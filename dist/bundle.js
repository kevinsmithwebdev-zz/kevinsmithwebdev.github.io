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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// let $ = require('jquery')
// // window.jQuery = $;
// require('bootstrap')

__webpack_require__(3);
__webpack_require__(6);

var URL_STEM = '';
var GALLERY_HEIGHT = '230px';
var MY_NAME = 'Kevin Smith';
var SITE_NAME = 'kevinsmithwebdev';
var CR_YEAR = 2017;

var isGalleryExpanded = false;

var $intro = $('#intro');
var $gallery = $('#gallery');
var $techs = $('#techs');
var $about = $('#about');
var $contact = $('#contact');
var $footer = $('#footer');

var $galleryBtn = $('#gallery-btn');
var $galleryModal = $('#gallery-modal');
var $galleryModalHeader = $('#modal-header');
var $galleryModalBody = $('#modal-body');
var $galleryModalFooter = $('#modal-footer');
var $galleryModalLink = $('#modal-link');
var $galleryModalCode = $('#modal-code');
var $galleryItem = $('.gallery-img');
var $galleryItem = $('.gallery-img');

var galleryArr = [];

$(document).ready(function () {

  // load data from local files and populate sections

  $.get(URL_STEM + '/data/intro.txt', function (data) {
    $intro.append(makeParas(data));
  });

  // preset gallery height
  $gallery.css({ 'height': GALLERY_HEIGHT });
  $.getJSON(URL_STEM + '/data/gallery.json', function (data) {
    $gallery.append(makeGallery(data));
    galleryArr = data.slice();
  });

  $.getJSON(URL_STEM + '/data/techs.json', function (data) {

    $techs.append(makeTech(data.frontend.text, data.frontend.list));
    $techs.append(makeTech(data.backend.text, data.backend.list));
    $techs.append(makeTech(data.other.text, data.other.list));
    $.get(URL_STEM + '/data/techs.txt', function (data) {
      $techs.append(makeParas(data));
    });
  });

  $.get(URL_STEM + '/data/about.txt', function (data) {
    $about.append(makeParas(data));
  });

  $.getJSON(URL_STEM + '/data/contacts.json', function (data) {
    $contact.append(makeContacts(data.main, 'main'));
    $contact.append(makeContacts(data.other, 'other'));
  });

  $footer.html('<p>&copy;' + CR_YEAR + ' - ' + MY_NAME);

  // click handlers

  $galleryBtn.click(function () {
    galleryHeight(isGalleryExpanded);
    if (isGalleryExpanded) $galleryBtn.html('Expand Gallery').removeClass('btn-danger').addClass('btn-success');else $galleryBtn.html('Collapse Gallery').removeClass('btn-success').addClass('btn-danger');
    isGalleryExpanded = !isGalleryExpanded;
  });

  $(document).on("click", '.gallery-item', function (event) {

    var gal = galleryArr[+this.id.replace(/^\D+/g, '')];

    $galleryModalHeader.html('<h2>' + gal.name + '</h2>');

    var html = '';
    html += '<div class="container-fluid">' + '<div class="row">' + '<div class="col-md-6">' + '<img src="' + imgUrl(gal.imgStem) + '" class="gal-img" alt="img for ' + gal.name + '">' + '</div>' + '<div class="col-md-6">' + makeParas(gal.text) + '<hr/>' + horizTechList(gal.techs) + '</div>' + '</div>' + // row
    '</div>'; // container

    $galleryModalBody.html(html);

    $galleryModalLink.attr('href', gal.url);
    $galleryModalCode.attr('href', gal.code);
    $galleryModal.modal('show').css({ 'margin': 0 });
  });

  //*************

  // gallery adjusments
  function galleryHeight(isExpanded) {
    if (isExpanded) {
      $gallery.css({ 'flex-grow': '', 'height': GALLERY_HEIGHT });
    } else {
      $gallery.css({ 'flex-grow': 1, 'height': '' });
    }
  }
});

// functions to build div content

function makeParas(text) {
  var newArr = [];
  text.split('\n').forEach(function (para) {
    para = para.trim();
    if (para) newArr.push('<p>' + para + '</p>');
  });
  return newArr.join('\n');
}

function makeTech(title, list) {
  var html = '';
  html += '<h3>' + title + '</h3>';
  html += horizTechList(list);

  return html;
}

var techElement = function techElement(tech) {
  return '<h4>' + '<img class="tech-logo" src="./img/logos/' + techFileName(tech) + '" alt="logo for ' + tech + '">' + tech + '</h4>';
};
var techFileName = function techFileName(tech) {
  return tech.replace(/ /g, '').toLowerCase() + '.png';
};

function horizTechList(techs) {
  var html = '<ul id="gal-ul">';
  techs.forEach(function (tech) {
    html += '<li class="gal-li">' + techElement(tech) + '</li>';
  });
  html += '</ul>';

  return html;
}

function makeContacts(contacts, category) {
  var html = '';
  html += '<h3>' + contacts.text + '</h3>';
  html += '<ul id="contact-ul">';

  contacts.list.forEach(function (contact) {

    html += '<li class="contact-li">' + '<h4>' + '<i class="fa fa-2x ' + contact.icon + '" aria-hidden="true"></i>&nbsp;' + (contact.action ? '<a href="' + contact.action + '">' : '') + contact.name + (contact.action ? '</a>' : '') + '</h4>' + '</li>';
  });

  html += '</ul>';

  return html;
}

function makeGallery(sites) {
  var html = '';

  sites.forEach(function (site, index) {

    html += '<figure id="gallery-' + index + '" class="gallery-item">' + '<img class="gallery-img" src="' + imgTnUrl(site.imgStem) + '" />' + '<figcaption class="gallery-caption">' + site.name + '</figcaption>' + '</figure>';
  });
  return html;
}

var imgUrl = function imgUrl(stem) {
  return URL_STEM + '/img/gallery/' + stem + '.png';
};

var imgTnUrl = function imgTnUrl(stem) {
  return URL_STEM + '/img/gallery/' + stem + '-tn.png';
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js?url=false!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js?url=false!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\r\n  background: url('../../img/bg.jpg') no-repeat center center fixed;\r\n  -webkit-background-size: cover;\r\n  -moz-background-size: cover;\r\n  -o-background-size: cover;\r\n  background-size: cover;\r\n  margin-top: 50px;\r\n  padding-top: 50px;\r\n}\r\n\r\nh1 {\r\n  font-family: 'Titillium Web', sans-serif;\r\n  font-weight: boldest;\r\n  text-transform: uppercase;\r\n}\r\n\r\nh2 {\r\n  font-family: 'Titillium Web', sans-serif;\r\n  font-weight: bold;\r\n  font-variant:small-caps;\r\n}\r\n\r\nh3 {\r\n  font-family: 'Titillium Web', sans-serif;\r\n  font-style: italic;\r\n  text-indent: 30px;\r\n}\r\n\r\nh4 {\r\n  font-family: 'Titillium Web', sans-serif;\r\n  font-size: 22px;\r\n}\r\n\r\np {\r\n  font-family: 'Roboto Slab', serif;\r\n  font-size: 22px;\r\n}\r\n\r\n/*  navbar  */\r\n.brand-word {\r\n  display: inline-block;\r\n}\r\n.brand-word::first-letter {\r\n  color: #ccc\r\n}\r\n\r\n.navbar-brand {\r\n  pointer-events: none;\r\n}\r\n\r\n.navbar-contacts {\r\n  padding-right: 20px;\r\n}\r\n\r\n\r\n/*************/\r\n\r\n.text-area {\r\n  margin: 50px 100px;\r\n  border-radius: 5px;\r\n  min-height: 200px;\r\n  padding: 30px 20px 20px 20px;\r\n  background-color: rgba(245, 255, 245, 0.85); /* pale green */\r\n  color: black;\r\n}\r\n\r\n/* techs */\r\n\r\n.tech-logo {\r\n  width: 40px;\r\n  height: 40px;\r\n  margin-right: 5px;\r\n}\r\n.container {\r\n  list-style:none;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n.item {\r\n  /*border: 1px red solid;*/\r\n  padding: 5px;\r\n  width: 180px;\r\n  height: 50px;\r\n  margin: 10px;\r\n  color: black;\r\n  text-align: left;\r\n}\r\n\r\n.item-contact-main {\r\n  /*border: 1px red solid;*/\r\n  width: 30%;\r\n}\r\n\r\n.item-contact-other {\r\n  /*border: 1px red solid;*/\r\n}\r\n\r\n.float {\r\n  max-width: 1200px;\r\n  margin: 0 auto;\r\n}\r\n\r\n.float:after {\r\n  content: \".\";\r\n  display: block;\r\n  height: 0;\r\n  clear: both;\r\n  visibility: hidden;\r\n}\r\n\r\n.float-item {\r\n  float: left;\r\n}\r\n\r\n.tech-list {\r\n  margin: 10px 0 30px 20px;\r\n  width: 100%\r\n}\r\n\r\n\r\n/*************/\r\n\r\n#footer {\r\n  text-align: center;\r\n  color: antiquewhite;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js?url=false!./gallery.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js?url=false!./gallery.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#gallery {\r\n  width: 100%;\r\n  /*height: 230px;*/ /* set in JS */\r\n  overflow: hidden;\r\n  transition: height 0.5s;\r\n  -moz-transition: height 0.5s; /* Firefox 4 */\r\n  -webkit-transition: height 0.5s; /* Safari and Chrome */\r\n  -o-transition: height 0.5s; /* Opera */\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  justify-content: space-around;\r\n}\r\n\r\n.gallery-item {\r\n  width: 200px;\r\n  height: 150px;\r\n  transition: all .4s ease-in-out;\r\n  margin: 2em .5em;\r\n}\r\n\r\n.gallery-item:hover {\r\n  transform: scale(.97);\r\n}\r\n\r\n\r\nfigure img {\r\n  display: block;\r\n  width: 200px;\r\n  height: auto;\r\n  margin: 0 auto;\r\n}\r\n\r\nfigcaption {\r\n  display: block;\r\n  padding: 2px;\r\n}\r\n\r\n\r\n.gallery-caption {\r\n  text-align: center;\r\n  font-weight: bold;\r\n  font-style: italic;\r\n}\r\n\r\n#gallery-btn {\r\n  text-align: center;\r\n  font-size: 24px;\r\n  margin-top: 10px;\r\n}\r\n\r\n#wrapper {\r\n  width: 100%;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n}\r\n\r\n#gallery-modal {\r\n  /*width: 90%;*/\r\n\r\n}\r\n\r\n.gal-img {\r\n  width: 100%;\r\n  height: auto;\r\n  border-radius: 4px;\r\n}\r\n\r\n#gal-ul > li {\r\n  display: inline-block;\r\n  margin: 5px 30px 10px 0;\r\n  zoom: 1;\r\n  *display:inline; /* for IE7- */\r\n}\r\n\r\n#contact-ul > li {\r\n  display: inline-block;\r\n  margin: 5px 50px 10px 0;\r\n  zoom: 1;\r\n  *display:inline; /* for IE7- */\r\n}\r\n\r\n.modal-content{\r\n  display: inline-block;\r\n}\r\n\r\n.modal-wide .modal-dialog {\r\n  width: 80%;\r\n  overflow: wrapper;\r\n}\r\n\r\n#modal-footer {\r\n  text-align: center;\r\n}\r\n\r\n#modal-footer > * {\r\n  font-size: 22px;\r\n  margin: 5px 25px;\r\n}\r\n", ""]);

// exports


/***/ })
/******/ ]);