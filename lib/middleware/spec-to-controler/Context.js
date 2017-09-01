"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
  function Context() {
    _classCallCheck(this, Context);

    this.index = -1;
  }

  _createClass(Context, [{
    key: "getContext",
    value: function getContext() {
      this.index += 1;
      var context = {
        index: this.index,
        time: new Date()
      };
      return context;
    }
  }, {
    key: "resetContext",
    value: function resetContext() {
      this.index = -1;
    }
  }]);

  return Context;
}();

exports.default = Context;