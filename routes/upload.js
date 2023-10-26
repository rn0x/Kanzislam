import Jimp from 'jimp';
import ffmpeg from 'fluent-ffmpeg';

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
                return response.status(400).json({ error: 'حجم الملف كبير جدًا. يجب ألا يتجاوز 50 ميجابايت.' });
            }

            // Generate a unique file name
            const fileName = Date.now() + path.extname(file.name);

            // Get file information
            const fileInfo = {
                name: file.name,
                extname: path.extname(file.name),
                type: file.mimetype,
                size: file.size,
                path: `/uploads/${fileName}`,
                buffer: file.data
            };

            // Move the file to the uploads folder
            const defPath = "public/uploads";
            const fileBuffer = file.data;

            if (fileInfo.type === "image/jpeg" || fileInfo.type === "image/png") {
                const watermarkPath = path.join(__dirname, 'public/images/watermark.png');

                if (fs.existsSync(watermarkPath)) {
                    // قم بقراءة الصورة الرئيسية والعلامة المائية باستخدام Jimp
                    const mainImage = await Jimp.read(fileBuffer);
                    const watermark = await Jimp.read(watermarkPath);

                    // حدد حجم العلامة المائية بنسبة معينة من حجم الصورة الرئيسية (مثل 10٪)
                    const watermarkWidth = mainImage.getWidth() * 0.1; // اضبط هذه النسبة على ما يناسبك
                    const watermarkHeight = (watermarkWidth / watermark.getWidth()) * watermark.getHeight();
                    watermark.resize(watermarkWidth, watermarkHeight);

                    // اضبط موقع العلامة المائية في الزاوية اليمنى السفلى
                    const xPos = mainImage.getWidth() - watermarkWidth - 10; // ضع القيمة المناسبة بدلاً من 10
                    const yPos = mainImage.getHeight() - watermarkHeight - 10; // ضع القيمة المناسبة بدلاً من 10

                    // قم بإضافة العلامة المائية إلى الصورة الرئيسية
                    mainImage.composite(watermark, xPos, yPos, {
                        mode: Jimp.BLEND_SOURCE_OVER,
                        opacitySource: 0.5,
                        opacityDest: 1
                    });

                    // حفظ الصورة مع العلامة المائية
                    const imageBuffer = await mainImage.getBufferAsync(Jimp.MIME_JPEG); // استخراج الصورة مع العلامة المائية كمصفوفة بيانات
                    fs.writeFileSync(`${defPath}/images/${fileName}`, imageBuffer); // حفظ الصورة في المجلد

                    fileInfo.path = `/uploads/images/${fileName}`;
                }
            } else if (fileInfo.type === "video/mp4") {
                const watermarkPath = path.join(__dirname, 'public/images/watermark-50px.png');
                if (fs.existsSync(watermarkPath)) {
                    const outputVideoPath = path.join(__dirname, 'public/uploads/videos', fileName);
                    const videoPath = path.join(__dirname, 'public/uploads', fileName);
                    fs.writeFileSync(videoPath, fileBuffer); // حفظ الملف على الجهاز
                    const ffmpegCommand = ffmpeg();

                    ffmpegCommand.input(videoPath);
                    // موقع العلامة المائية في الزاوية اليمنى السفلية
                    const xPos = 'main_w-overlay_w-10';
                    const yPos = 'main_h-overlay_h-10';


                    ffmpegCommand.input(watermarkPath);
                    ffmpegCommand.complexFilter([`overlay=${xPos}:${yPos}`]);
                    ffmpegCommand.videoCodec('libx264');
                    ffmpegCommand.audioCodec('aac');
                    ffmpegCommand.output(outputVideoPath);

                    ffmpegCommand.on('end', async () => {
                        console.log('تم وضع العلامة المائية على الفيديو بنجاح.');
                        // بعد الانتهاء من معالجة الفيديو وحفظ النسخة مع العلامة المائية
                        // قم بحذف النسخة الأصلية (بدون العلامة المائية)
                        fs.unlinkSync(videoPath);
                        // هنا يمكنك إضافة معلومات الفيديو إلى قاعدة البيانات إذا كنت بحاجة إلى ذلك
                    });

                    ffmpegCommand.on('error', (err) => {
                        console.error('حدث خطأ أثناء وضع العلامة المائية على الفيديو:', err);
                        response.status(500).json({ error: 'حدث خطأ أثناء معالجة الفيديو.' });
                    });

                    ffmpegCommand.run();
                    fileInfo.path = `/uploads/videos/${fileName}`;
                }
            } else if (fileInfo.type === "audio/mpeg") {
                fs.writeFileSync(`${defPath}/audios/${fileName}`, fileBuffer);
                fileInfo.path = `/uploads/audios/${fileName}`;
            } else if (fileInfo.type === "application/pdf") {
                fs.writeFileSync(`${defPath}/pdfs/${fileName}`, fileBuffer);
                fileInfo.path = `/uploads/pdfs/${fileName}`;
            }

            // Send a success response with the file information
            response.json({
                uploaded: true,
                file: fileInfo,
                url: config.WEBSITE_DOMAIN + fileInfo.path
            });

            switch (fileInfo.type) {
                case 'image/jpeg':
                case 'image/png':
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
                case 'video/quicktime':
                case 'video/webm':
                case 'video/ogg':
                case 'video/avi':
                case 'video/wmv':
                    const lastVideosId = await Videos.max('video_id').catch((error) => {
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
                    const lastAudiosId = await Audios.max('audio_id').catch((error) => {
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
                    const lastPdfsId = await Pdfs.max('pdf_id').catch((error) => {
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