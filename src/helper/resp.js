function makeResp(data, code = 200, msg = 'ok') {
  return {
    code,
    msg,
    data,
  };
}

module.exports = makeResp;