export default (param) => {

    const { app, pug, path, fs, config, __dirname, jsStringify } = param;
    app.post('/logout', async (request, response) => {

        request.session.destroy();
        response.json({ logout: true, massage: 'تم تسجيل الخروج بنجاح' });
    });
}