const fs = require('fs');
const path = require('path');
const { HOST, CLIENT_PORT } = require('../../app/env');
const { STATUS_CODE, imgUploadPath } = require('../../constance');
const { TABLE_NAMES, USER_IMGS_TABLE } = require('../../constance/tables');

class FileController {
  // 上传图片，不需要用户信息
  async uploadImg(ctx) {
    const { filename, mimetype, size, encoding } = ctx.file;
    const fileInfo = { filename, mimetype, size, encoding };
    const result = await ctx.service.dbService.insert(fileInfo, TABLE_NAMES.IMGS);

    const successed = result.insertId !== undefined;
    if (successed) {
      const sep = path.sep;
      // 设置图片url地址, 不设置host + port，前端通过get请求获取图片
      fileInfo.url = `${sep}api${sep}file${sep}get${sep}img${sep + filename}`;
    }
    return ctx.makeResp({
      code: successed ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR,
      data: fileInfo ? fileInfo : undefined,
    });
  }
  async userUploadImg(ctx) {
    const { filename, mimetype, size, encoding } = ctx.file;
    const fileInfo = { filename, mimetype, size, encoding, [USER_IMGS_TABLE.USER_ID]: ctx.user.userId };
    const result = await ctx.service.dbService.insert(fileInfo, TABLE_NAMES.USER_IMGS);
    const successed = result.insertId !== undefined;
    if (successed) {
      const sep = path.sep;
      // 设置图片url地址, 不设置host + port，前端通过get请求获取图片
      fileInfo.url = `${sep}api${sep}file${sep}user${sep}get${sep}img${sep + filename}`;
    }
    return ctx.makeResp({
      code: successed ? STATUS_CODE.SUCCESS : STATUS_CODE.ERROR,
      data: fileInfo ? fileInfo : undefined,
    });
  }
  // 获取图片信息
  async getImgByFilename(ctx) {
    const { filename } = ctx.params;
    // 根据filename查询图片
    const result = await ctx.service.dbService.query({ filename }, TABLE_NAMES.IMGS);
    const file = result[0];
    if(!file) {
      return;
    }
    const filePath = imgUploadPath + path.sep + file.filename;
    ctx.response.set('Content-Type', file.mimetype);
    ctx.body = fs.createReadStream(filePath);
  }
    // 获取图片信息
    async getUserImgByFilename(ctx) {
      const { filename } = ctx.params;
      // 根据filename查询图片
      const result = await ctx.service.dbService.query({ filename }, TABLE_NAMES.USER_IMGS);
      const file = result[0];
      if(!file) {
        return;
      }
      const filePath = imgUploadPath + path.sep + file.filename;
      ctx.response.set('Content-Type', file.mimetype);
      ctx.body = fs.createReadStream(filePath);
    }
}

module.exports = new FileController();
