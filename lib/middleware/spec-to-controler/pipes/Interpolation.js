'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Pipeline2 = require('./Pipeline');

var _Pipeline3 = _interopRequireDefault(_Pipeline2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const isObject = target =>
//   Object.prototype.toString.call(target) === '[object Object]';

// const typeMap = {
//   'number': Number,
// };

function supplant(string, props) {
  var result = string.replace(/{([^{}]*)}/g, function (match, expr) {
    var value = props[expr];
    return typeof value === 'string' || typeof value === 'number' ? value : match;
  });

  result = result.replace(/"{#([^{}]*)}"/g, function (match, expr) {
    var value = props[expr];
    return typeof value === 'string' || typeof value === 'number' ? value : match;
  });
  return result;
}

function interpolate(obj, props) {
  var str = JSON.stringify(obj);
  return supplant(str, props);
}

// function typeReconcile(input) {
//   const result = {
//     ...input,
//   };

//   Object.keys(input).filter(key => key.endsWith('@number'))
//     .forEach(key => {
//       const propertyValue = input[key];
//       if (isObject(propertyValue)) {
//         result[key] = typeReconcile(propertyValue);
//         return;
//       }

//       const matches = key.match(/(.*)@(.*)$/i);
//       const [property, typeMagic] = matches;
//       const type = typeMagic.slice(1);
//       const typeConstructer = typeMap[type];
//       if (typeConstructer === undefined) {
//         return;
//       }

//       result[property] = new typeConstructer(propertyValue).valueOf();
//     });

//   return result;
// }

var Interpolation = function (_Pipeline) {
  _inherits(Interpolation, _Pipeline);

  function Interpolation() {
    _classCallCheck(this, Interpolation);

    return _possibleConstructorReturn(this, (Interpolation.__proto__ || Object.getPrototypeOf(Interpolation)).apply(this, arguments));
  }

  _createClass(Interpolation, [{
    key: 'valueGen',
    value: function valueGen(data) {
      var context = data.context,
          content = data.content;


      var result = JSON.parse(interpolate(content, _extends({}, context, {
        time: context.time.getTime()
      })));

      return _extends({}, data, {
        content: result
      });
    }
  }]);

  return Interpolation;
}(_Pipeline3.default);

exports.default = Interpolation;