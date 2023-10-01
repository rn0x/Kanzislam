export default async (param) => {

    param.app.get('/', async (request, response) => {

        console.log(param.config);
        let Options = {};
        Options.title = "title page"
        let pugPath = param.path.join(param.__dirname, './views/home.pug');
        let render = param.pug.renderFile(pugPath, Options);
        response.send(render);
    });
}