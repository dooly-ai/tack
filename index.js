(function() {
  'use strict';

  var indexedStyles = {};

  var _sheet = null;
  var tackClasses = new Set();

  const COMPLEX_SELECTOR_TOKENS = [' ', '.', ':', '[', ']'];

  function isClassSelector(selectorText) {
    if (selectorText[0] !== '.') {
      return false;
    }
    for (var i = 1; i < selectorText.length; i++) {
      if (COMPLEX_SELECTOR_TOKENS.indexOf(selectorText[i]) !== -1) {
        return false;
      }
    }
    return true;
  }

  function sheet() {
    if (_sheet) {
      return _sheet;
    }

    var style = document.createElement('style');

    // WebKit support.
    style.appendChild(document.createTextNode(''));

    document.head.appendChild(style);
    _sheet = style.sheet;
    return _sheet;
  }

  var Tack = function(pseudoClass) {
    const classes = [].splice.call(arguments, 1);
    return classes
      .map(className => {
        if (!className) {
          return null;
        }

        if (className[0] !== '.') {
          className = '.' + className;
        }

        const style = indexedStyles[className];
        if (!style) {
          // Unknown style.
          return null;
        }

        const tackClassName = className + '--tack-' + pseudoClass;

        if (!tackClasses.has(tackClassName)) {
          // Generate CSS class.
          const rulesIndex = style.cssText.indexOf('{');
          if (rulesIndex === -1) {
            // Couldn't find CSS rules.
            return null;
          }
          const rules = style.cssText.substring(rulesIndex);

          sheet().insertRule(tackClassName + ':' + pseudoClass + ' ' + rules);
          tackClasses.add(tackClassName);
        }

        return tackClassName.substring(1);
      })
      .filter(tackClassName => !!tackClassName)
      .join(' ');
  }

  Tack.hash = function() {
    indexedStyles = {};

    Array.prototype.forEach.call(document.styleSheets, function(styleSheet) {
      Array.prototype.forEach.call(styleSheet.cssRules || [], function(cssRule) {
        const selectorText = cssRule.selectorText;

        if (!selectorText || !isClassSelector(selectorText)) {
          return;
        }

        indexedStyles[selectorText] = cssRule;
      });
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tack;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    // Register as 'tack-css', consistent with npm package name.
    define('tack-css', [], function () {
      return Tack;
    });
  } else {
    window.tack = Tack;
  }
}());
