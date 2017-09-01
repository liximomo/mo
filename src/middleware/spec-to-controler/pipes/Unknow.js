import Pipeline from './Pipeline';

class Unknow extends Pipeline {
  valueGen(data) {
    return Object.assign({}, data, {
      content: {
        code: 118,
        msg: '未知的 rule',
        data: null,
      }
    });
  }
}

export default Unknow;