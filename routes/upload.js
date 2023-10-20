export default async ({ app, path, fs, config, __dirname, model }) => {
    const { Users, Images, Videos, Audios, Pdfs } = model;

    // Define a route for uploading files
    app.post('/api/upload', async (request, response) => {
        try {
            let user;

            // Check if the user is logged in or if a valid token and username are provided in the request body
            if (!request.session.isLoggedIn) {
                const { username, token } = request.body;
                if (!username || !token) {
                    return response.status(400).json({ error: 'يرجى تقديم اسم المستخدم والرمز.' });
                }
                user = await Users.findOne({ where: { username } });
                if (!(user?.dataValues?.token === token)) {
                    return response.status(401).json({ error: 'غير مصرح لك برفع الملفات.' });
                }
            }

            if (request?.session?.isLoggedIn) {
                const { username } = request.session;
                user = await Users.findOne({ where: { username } });
            }

            // Check if there is a file in the request
            const file = request.files?.upload;
            if (!file) {
                return response.status(400).json({ error: 'لم يتم رفع أي ملفات.' });
            }

            // Check the file type
            const allowedFileTypes = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'application/pdf'];
            if (!allowedFileTypes.includes(file.mimetype)) {
                return response.status(400).json({ error: 'نوع الملف غير صالح.' });
            }

            // Check the file size
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                return response.status(400).json({ error: `${maxSize} حجم الملف كبير جدًا. تجاوز الـ ` });
            }

            // Generate a unique file name
            const fileName = Date.now() + path.extname(file.name);

            // Get file information
            const fileInfo = {
                name: file.name,
                extname: path.extname(file.name),
                type: file.mimetype,
                size: file.size,
                path: `/uploads/${fileName}`
            };

            // Move the file to the uploads folder
            const defPath = "public/uploads"
            if (fileInfo.type === "image/jpeg" || fileInfo.type === "image/png") {
                await file.mv(path.join(defPath, "images", fileName));
                fileInfo.path = `/uploads/images/${fileName}`;
            } else if (fileInfo.type === "video/mp4") {
                await file.mv(path.join(defPath, "videos", fileName));
                fileInfo.path = `/uploads/videos/${fileName}`;
            } else if (fileInfo.type === "audio/mpeg") {
                await file.mv(path.join(defPath, "audios", fileName));
                fileInfo.path = `/uploads/audios/${fileName}`;
            } else if (fileInfo.type === "application/pdf") {
                await file.mv(path.join(defPath, "pdfs", fileName));
                fileInfo.path = `/uploads/pdfs/${fileName}`;
            }

            // Send a success response with the file information
            response.json({
                uploaded: true,
                file: fileInfo,
                url: config.WEBSITE_DOMAIN + fileInfo.path
            });

            // Check the file type and add it to the corresponding table
            switch (fileInfo.type) {
                case 'image/jpeg':
                case 'image/png':
                    // Add the file to the Images table
                    const lastImagesId = await Images.max('image_id').catch((error) => {
                        console.log(error);
                    });
                    await Images.create({
                        image_id: lastImagesId + 1,
                        user_id: user?.dataValues?.user_id,
                        image_url: fileInfo.path
                    }).catch((error) => {
                        console.log(error);
                    });
                    break;
                case 'video/mp4':
                    // Add the file to the Videos table
                    const lastVideosId = await Images.max('video_id').catch((error) => {
                        console.log(error);
                    });
                    await Videos.create({
                        video_id: lastVideosId + 1,
                        user_id: user?.dataValues?.user_id,
                        video_url: fileInfo.path
                    }).catch((error) => {
                        console.log(error);
                    });
                    break;
                case 'audio/mpeg':
                    // Add the file to the Audios table
                    const lastAudiosId = await Images.max('audio_id').catch((error) => {
                        console.log(error);
                    });
                    await Audios.create({
                        audio_id: lastAudiosId + 1,
                        user_id: user?.dataValues?.user_id,
                        audio_url: fileInfo.path
                    }).catch((error) => {
                        console.log(error);
                    });
                    break;
                case 'application/pdf':
                    // Add the file to the Pdfs table
                    const lastPdfsId = await Images.max('pdf_id').catch((error) => {
                        console.log(error);
                    });
                    await Pdfs.create({
                        pdf_id: lastPdfsId + 1,
                        user_id: user?.dataValues?.user_id,
                        pdf_url: fileInfo.path
                    }).catch((error) => {
                        console.log(error);
                    });
                    break;
                default:
                    // Handle other file types if needed
                    break;
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'حدث خطأ أثناء رفع الملف.' });
        }
    });
};  