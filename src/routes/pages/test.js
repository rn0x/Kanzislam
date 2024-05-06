import path from "node:path";

export default async (router, config, readFile, logger) => {
  const { logError } = logger;
  try {
    const fileJson = await readFile(path.join(config.paths.json, "file.json"));
    router.get("/radio", (req, res) => {
      res.render("pages/radio", {
        options: {
          website_name: config.website_name,
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
    router.get("/data-file", (req, res) => {
      res.status(200).json(radioJson);
    });
  } catch (error) {
    logError(error);
  }
};
