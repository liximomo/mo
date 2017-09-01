function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Pipeline {
  constructor(option) {
    this.option = option;
  }

  valueGen(data) {
    return _asyncToGenerator(function* () {
      return data;
    })();
  }

  value(data) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const value = yield _this.valueGen(data);
      return value;
    })();
  }

  resetContext() {
    this.index = -1;
  }
}

export default Pipeline;