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

var RespSimple = function (_Pipeline) {
  _inherits(RespSimple, _Pipeline);

  function RespSimple() {
    _classCallCheck(this, RespSimple);

    return _possibleConstructorReturn(this, (RespSimple.__proto__ || Object.getPrototypeOf(RespSimple)).apply(this, arguments));
  }

  _createClass(RespSimple, [{
    key: 'valueGen',
    value: function valueGen(data) {
      var content = data.content;


      var source = _extends({
        code: 200,
        msg: 'ok'
      }, this.option);

      var code = source.code,
          msg = source.msg;


      var output = void 0;
      if (content.code !== undefined && content.msg !== undefined && content.data !== undefined) {
        output = _extends({}, content.data, {
          code: code,
          msg: msg
        });
      }

      output = {
        data: content,
        code: code,
        msg: msg
      };

      return _extends({}, data, {
        content: output
      });
    }
  }]);

  return RespSimple;
}(_Pipeline3.default);

exports.default = RespSimple;