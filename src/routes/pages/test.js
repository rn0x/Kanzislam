import path from "node:path";

export default async (router, config, readFile) => {

  router.get("/radio", (req, res) => {
    res.render("pages/radio", {
      options: {
        title: `title`,
        keywords: [
          "key1",
          "key1",
          "key3",
        ],
        description:"description",
        preview: `${config.domain}/images/preview-kanz.jpg`,
      },
    });
  });

  // TODO: REMOVE THIS !!! (AND REPLACE RADIO.JS CODE)
  router.get("/data-file",async (req, res) => {
    const fileJson = await readFile(path.join(config.paths.json, "file.json"));
    res.status(200).json(radioJson);
  });
};
