const createUploadsFolder = async ({ path, fs, __dirname }) => {
    const uploadsPath = path.join(__dirname, 'public', 'uploads');
    const imagesPath = path.join(uploadsPath, 'images');
    const videosPath = path.join(uploadsPath, 'videos');
    const pdfsPath = path.join(uploadsPath, 'pdfs');
    const audiosPath = path.join(uploadsPath, 'audios');

    // التحقق من وجود المجلدات وإنشائها إذا لم تكن موجودة
    fs.ensureDirSync(uploadsPath);
    fs.ensureDirSync(imagesPath);
    fs.ensureDirSync(videosPath);
    fs.ensureDirSync(pdfsPath);
    fs.ensureDirSync(audiosPath);
};

export default createUploadsFolder;
