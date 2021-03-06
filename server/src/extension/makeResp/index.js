function makeResp({ code, message = 'success', data }) {
    if (data !== undefined) {
      data = typeof data === 'object' ? data : { data };
    }
    resp = {
      code: code !== undefined ? code : STATUS_CODE.SUCCESS,
      message,
    };
    if (data && Object.keys(data).length) {
      resp.data = data;
    }
    // 防止继续往下执行
    this.body = resp;
  }

  module.exports = makeResp;