export default async ({ app, pug, path, fs, config, __dirname, jsStringify, model }) => {

    const {
        Pageviews,
        Users,
        Categories,
        Topics,
        Comments,
        Likes,
        Tags,
        Images
    } = model;

    app.get('/analytics', async (request, response) => {

        const getUsers = await Users.findAll().catch((error) => {
            console.log(error);
        });
        const getCategories = await Categories.findAll().catch((error) => {
            console.log(error);
        });
        const getTopics = await Topics.findAll().catch((error) => {
            console.log(error);
        });
        const getComments = await Comments.findAll().catch((error) => {
            console.log(error);
        });
        const getPageviews = await Pageviews.findAll().catch((error) => {
            console.log(error);
        });
        const getLikes = await Likes.findAll().catch((error) => {
            console.log(error);
        });
        const getTags = await Tags.findAll().catch((error) => {
            console.log(error);
        });
        const getImages = await Images.findAll().catch((error) => {
            console.log(error);
        });

        response.json({
            Users: getUsers?.length || 0,
            Categories: getCategories?.length || 0,
            Topics: getTopics?.length || 0,
            Comments: getComments?.length || 0,
            Pageviews: getPageviews?.length || 0,
            Likes: getLikes?.length || 0,
            Tags: getTags?.length || 0,
            Images: getImages?.length || 0,
        });
    });
}