class Pipeline {
  constructor(option) {
    this.option = option;
  }

  async valueGen(data) {
    return data;
  }

  async value(data) {
    const value = await this.valueGen(data);
    return value;
  }

  resetContext() {
    this.index = -1;
  }
}

module.exports = Pipeline;