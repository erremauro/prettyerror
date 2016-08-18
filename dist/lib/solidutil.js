'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var SolidUtil = {
  isType: isType
};

function isType(obj, type) {
  if (typeof type === 'string') {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === type) return true;
    if (obj.constructor.name === type) return true;

    if (obj.hasOwnProperty('name')) {
      if (obj.name === type) return true;
    }
  }

  if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
    if (obj instanceof type) return true;
  }

  return false;
}

exports.default = SolidUtil;