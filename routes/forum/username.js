import error from '../error.js';

export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model, getElapsedTime }) => {

    const {
        Users,
        Categories,
        Topics,
        Comments,
        Tags,
        Likes,
        Reports,
        Views,
        Notifications,
        Images,
        Videos,
        Audios,
    } = model;

    app.get('/username/:username', async (request, response) => {

        const username = request.params?.username?.toLocaleLowerCase();
        const GetUser = await Users.findOne({
            where: { username: username }
        }).catch((error) => {
            console.log(error);
        });
        if (GetUser) {
            const options = {
                website_name: config.WEBSITE_NAME,
                title: `الملف الشخصي للعضو @${GetUser?.username} - ${GetUser?.name} - ${config.WEBSITE_NAME}`,
                keywords: [GetUser?.name, GetUser?.username, "عضوية", "ملف شخصي", "معلومات شخصية", "اهتمامات"],
                description: `يحتوي الملف الشخصي على معلومات شخصية حول العضوية ${GetUser?.username} - ${GetUser?.name}`,
                preview: `${config.WEBSITE_DOMAIN}/puppeteer?title=${encodeURIComponent(`الملف الشخصي للعضو @${GetUser?.username} - ${GetUser?.name}`)}&description=${encodeURIComponent(`يحتوي الملف الشخصي على معلومات شخصية حول العضوية @${GetUser?.username} - ${GetUser?.name}`)}`,
                session: request.session,
                user: {
                    user_id: GetUser?.user_id,
                    name: GetUser?.name,
                    username: GetUser?.username,
                    type: GetUser?.type,
                    profile: GetUser?.profile,
                    telegram: GetUser?.telegram,
                    createdAt: GetUser?.createdAt,
                },
                getElapsedTime: getElapsedTime
            };
            const pugPath = path.join(__dirname, './views/forum/username.pug');
            const render = pug.renderFile(pugPath, { options, jsStringify });
            response.send(render);
        }

        else {
            await error({ config, request, path, response, __dirname, pug, jsStringify });
        }
    });

    app.get('/get-username', async (request, response) => {
        const username = request.query?.username?.toLocaleLowerCase();
        const GetUser = await Users.findOne({
            where: { username: username }
        }).catch((error) => {
            console.log(error);
        });

        if (GetUser) {

            const GetTopics = await Topics.findAll({
                where: { user_id: GetUser?.user_id }
            }).catch((error) => {
                console.log(error);
            });
            const rawTopics = GetTopics.map(topic => topic.get({ plain: true }));
            const getComments = await Comments.findAll({
                where: { user_id: GetUser?.user_id }
            }).catch((error) => {
                console.log(error);
            });
            const CommentsWithTopics = await Promise.all(getComments.map(async (comeent) => {
                try {
                    const GetTopics = await Topics.findOne({ where: { topic_id: comeent?.topic_id } });
                    if (GetTopics) {
                        return {
                            ...comeent.get({ plain: true }),
                            topic: {
                                ...GetTopics.get({ plain: true }),
                                content: undefined,
                                content_raw: undefined
                            }
                        };
                    }
                } catch (error) {
                    console.log(error);
                }
            }));
            const getLikes = await Likes.findAll({
                where: { user_id: GetUser?.user_id }
            }).catch((error) => {
                console.log(error);
            });
            const likesWithTopics = await Promise.all(getLikes.map(async (like) => {
                try {
                    const GetTopics = await Topics.findOne({ where: { topic_id: like?.topic_id } });
                    if (GetTopics) {
                        return {
                            ...like.get({ plain: true }),
                            topic: {
                                ...GetTopics.get({ plain: true }),
                                content: undefined,
                                content_raw: undefined
                            }
                        };
                    }
                } catch (error) {
                    console.log(error);
                }
            }));
            const user = {
                user_id: GetUser?.user_id,
                name: GetUser?.name,
                username: GetUser?.username,
                type: GetUser?.type,
                profile: GetUser?.profile,
                telegram: GetUser?.telegram,
                createdAt: GetUser?.createdAt,
            }

            response.json({
                user: user,
                topics: rawTopics,
                comments: CommentsWithTopics,
                like: likesWithTopics,
            });
        }

        else {
            response.json({
                message: "نأسف، لم يتم تقديم اسم المستخدم الخاص بك. يرجى التأكد من إدخال اسم المستخدم الصحيح للمتابعة."
            });
        }
    });
}