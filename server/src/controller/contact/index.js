class ContactController {
    // 添加联系人
    async addContact(ctx) {
        const { userId } = ctx.request.body;
        console.log('userId', userId);
    }
}

module.exports = new ContactController();