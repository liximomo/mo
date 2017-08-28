class Context {
  constructor() {
    this.index = -1;
  }

  getContext() {
    this.index += 1;
    const context = ({
      index: this.index,
      time: new Date(),
    });
    return context;
  }

  resetContext() {
    this.index = -1;
  }
}

module.exports = Context;