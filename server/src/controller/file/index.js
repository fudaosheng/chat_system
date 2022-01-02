const fs = require('fs');
const path = require('path');
const {
  HOST,
  SERVER_PORT
} = require('../../app/env');
const { STATUS_CODE, imgUploadPath } = require('../../constance');
const { TABLE_NAMES } = require('../../constance/tables');

class FileController {
  async uploadImg(ctx) {
    const { filename, mimetype, size, encoding } = ctx.file;
    const fileInfo = { filename, mimetype, size, encoding };
    const result = await ctx.service.dbService.insert(fileInfo, TABLE_NAMES.IMGS);

    const successed = result.insertId !== undefined;
    if(successed) {
      const sep = path.sep;
      // 设置图片url地址, 将端口设置成前端端口号，否则会跨域
      fileInfo.url = `${HOST}:${SERVER_PORT+sep}file${sep}get${sep}img${sep+filename}`;
    }
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
