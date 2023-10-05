export default async (param) => {

    const config = param.config;
    param.app.post('/logout', async (request, response) => {

        request.session.destroy();
        response.json({ logout: true, massage: 'تم تسجيل الخروج بنجاح' });
    });
}