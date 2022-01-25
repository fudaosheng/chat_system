const KoaRouter = require('koa-router');
const multer = require('@koa/multer');
const { imgUploadPath } = require('../../constance');
const fileController = require('../../controller/fileController');

const router = new KoaRouter({ prefix: '/api/file' });

// 图片上传
const uploadImgMulter = multer({ dest: imgUploadPath });

// multer.single只允许文件名是img的文件
router.post('/upload/img', uploadImgMulter.single('img') , fileController.uploadImg);
// 用户上传图片
router.post('/user/upload/img', uploadImgMulter.single('img') , fileController.userUploadImg)

// 查找图片
router.get('/get/img/:filename', fileController.getImgByFilename);
// 查找图片
router.get('/user/get/img/:filename', fileController.getUserImgByFilename);

module.exports = router;