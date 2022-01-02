class UploadFileController {
    async uploadImg(ctx) {
        console.log('upload img');
        console.log(ctx.request.body);
        console.log(ctx.file);
        const { filename, mimetype, size, encoding } = ctx.request.body;
    }
}

module.exports = new UploadFileController();