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

var css_248z$1 = ".button{\n    background-color: white;\n}";
styleInject(css_248z$1);

function button(){
    return 'button'
}

var css_248z = ".alert{\n    background-color: black;\n}";
styleInject(css_248z);

function alert(){
    return 'alert'
}

var index = {
    Button: button,
    Alert: alert
};

export { index as default };
