const fs = require('fs');
const path = require('path');
const { STATUS_CODE, imgUploadPath } = require('../../constance');
const { TABLE_NAMES } = require('../../constance/tables');

class FileController {
  async uploadImg(ctx) {
    const { filename, mimetype, size, encoding } = ctx.file;
    const fileInfo = { filename, mimetype, size, encoding, user_id: ctx.user.userId };
    const result = await ctx.service.dbService.insert(fileInfo, TABLE_NAMES.IMGS);

    const successed = result.insertId !== undefined;
    return ctx.makeResp({
      code: successed ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR,
      data: fileInfo ? fileInfo : undefined,
    });
  }
  async getImgByFilename(ctx) {
    const { filename } = ctx.params;
    // 根据filename查询图片
    const result = await ctx.service.dbService.query({ filename }, TABLE_NAMES.IMGS);
    const file = result[0];
    const filePath = imgUploadPath + path.sep + file.filename;
    ctx.response.set('Content-Type', file.mimetype);
    ctx.body = fs.createReadStream(filePath);
  }
}

module.exports = new FileController();
