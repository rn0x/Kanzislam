export default async ({ app, pug, path, fs, config, __dirname, jsStringify }) => {

    app.post('/logout', async (request, response) => {

        request.session.destroy();
        response.json({ logout: true, massage: 'تم تسجيل الخروج بنجاح' });
    });
}