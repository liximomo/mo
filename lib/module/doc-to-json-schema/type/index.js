'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = typeToJsonSchema;
var TYPE_INTEGER = 'integer';
var TYPE_NUMBER = 'number';
var TYPE_STRING = 'string';
var TYPE_BOOLEAN = 'boolean';
var TYPE_ARRAY = 'array';
var TYPE_OBJECT = 'object';

function arrayEnHance(typeInfo, typeStr) {
  var subTypeStr = typeStr.match(/([a-zA-Z[\]]+)\[\]$/i);
  return typeInfo.items = parseType(subTypeStr || TYPE_STRING);
}

var rules = [{
  test: /(integer|int)/i,
  type: TYPE_INTEGER
}, {
  test: /(number|decimal|double)/i,
  type: TYPE_NUMBER
}, {
  test: /(string|date)/i,
  type: TYPE_STRING
}, {
  test: /array/i,
  type: TYPE_ARRAY,
  enhance: arrayEnHance
}, {
  test: /[a-zA-Z[\]]+\[\]$/i,
  type: TYPE_ARRAY,
  enhance: arrayEnHance
}, {
  test: /object$/i,
  type: TYPE_OBJECT
}, {
  test: /(dict|dic)$/i,
  type: TYPE_OBJECT
}];

function parseType(typeString) {
  var typeInfo = {
    type: TYPE_OBJECT,
    meta: {
      required: true
    }
  };

  var match = rules.find(function (rule) {
    return rule.test.test(typeString);
  });

  if (match === undefined) {
    console.warn('[warn]: \u4E0D\u80FD\u8BC6\u522B\u7684\u7C7B\u578B \'' + typeString + '\'');
    return typeInfo;
  }

  typeInfo.type = match.type;
  if (match.enhance) {
    match.enhance(typeInfo, typeString);
  }
  return typeInfo;
}

function typeToJsonSchema(keyInfo) {
  var result = {};

  delete keyInfo.meta;
  delete keyInfo.level;
  result.type = keyInfo.type;
  if (result.type === TYPE_OBJECT) {
    var properties = keyInfo.properties;
    if (properties !== undefined) {
      result.required = [];
      result.properties = {};
      Object.keys(properties).forEach(function (propertyName) {
        var propertyInfo = properties[propertyName];
        if (propertyInfo.meta.required) {
          result.required.push(propertyName);
        }

        result.properties[propertyName] = typeToJsonSchema(properties[propertyName]);
      });

      if (result.required.length <= 0) {
        delete result.required;
      }
    }
  } else if (result.type === TYPE_ARRAY) {
    result.items = typeToJsonSchema(_extends({}, keyInfo.items, {
      properties: keyInfo.properties
    }));
  } else {
    // do nothing
  }

  return result;
}

exports.TYPE_INTEGER = TYPE_INTEGER;
exports.TYPE_NUMBER = TYPE_NUMBER;
exports.TYPE_STRING = TYPE_STRING;
exports.TYPE_BOOLEAN = TYPE_BOOLEAN;
exports.TYPE_ARRAY = TYPE_ARRAY;
exports.TYPE_OBJECT = TYPE_OBJECT;
exports.parseType = parseType;