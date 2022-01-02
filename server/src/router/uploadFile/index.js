const KoaRouter = require('koa-router');
const multer = require('@koa/multer');
const { imgUploadPath } = require('../../constance');
const uploadFileController = require('../../controller/uploadFile');

const router = new KoaRouter({ prefix: '/upload' })

// 图片上传
const uploadImgMulter = multer({ dest: imgUploadPath });

// multer.single只允许文件名是img的文件
router.post('/img', uploadImgMulter.single('img') , uploadFileController.uploadImg);

module.exports = router;