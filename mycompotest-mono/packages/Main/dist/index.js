(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.main = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var dist$1 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  function styleInject(css, ref) {
	    if ( ref === void 0 ) ref = {};
	    var insertAt = ref.insertAt;

	    if (!css || typeof document === 'undefined') { return; }

	    var head = document.head || document.getElementsByTagName('head')[0];
	    var style = document.createElement('style');
	    style.type = 'text/css';

	    if (insertAt === 'top') {
	      if (head.firstChild) {
	        head.insertBefore(style, head.firstChild);
	      } else {
	        head.appendChild(style);
	      }
	    } else {
	      head.appendChild(style);
	    }

	    if (style.styleSheet) {
	      style.styleSheet.cssText = css;
	    } else {
	      style.appendChild(document.createTextNode(css));
	    }
	  }

	  var css_248z = ".button{\n    background-color: white;\n}";
	  styleInject(css_248z);

	  function button(){
	      return 'button'
	  }

	  return button;

	}));
	}(dist$1));

	var Button = dist$1.exports;

	var dist = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  function styleInject(css, ref) {
	    if ( ref === void 0 ) ref = {};
	    var insertAt = ref.insertAt;

	    if (!css || typeof document === 'undefined') { return; }

	    var head = document.head || document.getElementsByTagName('head')[0];
	    var style = document.createElement('style');
	    style.type = 'text/css';

	    if (insertAt === 'top') {
	      if (head.firstChild) {
	        head.insertBefore(style, head.firstChild);
	      } else {
	        head.appendChild(style);
	      }
	    } else {
	      head.appendChild(style);
	    }

	    if (style.styleSheet) {
	      style.styleSheet.cssText = css;
	    } else {
	      style.appendChild(document.createTextNode(css));
	    }
	  }

	  var css_248z = ".alert{\n    background-color: black;\n}";
	  styleInject(css_248z);

	  function alert(){
	      return 'alert'
	  }

	  return alert;

	}));
	}(dist));

	var Alert = dist.exports;

	var index = {
	    Button,
	    Alert
	};

	return index;

}));
