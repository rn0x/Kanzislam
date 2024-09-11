import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

/**
 * الرابط الأساسي لمستودع الملفات الخارجية
 */
const Repo = 'https://raw.githubusercontent.com/rn0x/kanzislam-data/main';
const manifestURL = `${Repo}/manifest.json`;
const root = path.resolve(process.cwd());
const localSrc = path.join(root, 'src');
const manifestLocalFilePath = path.join(localSrc, 'manifest.json');

/**
 * دالة لتنزيل ملف من المستودع الخارجي وحفظه محليًا
 * @param {object} file بيانات الملف المراد تنزيله
 */
const downloadFile = async (file) => {
    try {
        const response = await fetch(`${Repo}/${file.FilePath}/${file.FileName}`);
        const fileDataBuffer = await response.arrayBuffer();
        const fileData = Buffer.from(fileDataBuffer);
        const filePath = path.join(localSrc, `${file.FilePath}/${file.FileName}`);

        // إنشاء المسار المحلي إذا لم يكن موجودًا

        if (!fs.existsSync(path.join(localSrc, file.FilePath))) {
            fs.mkdirSync(path.join(localSrc, file.FilePath), { recursive: true });
        }

        fs.writeFileSync(filePath, fileData);
        console.log(`تم تنزيل ${file.FileName} بنجاح`);
    } catch (error) {
        // التعامل مع أي أخطاء في عملية التنزيل
        console.error(`حدث خطأ أثناء تنزيل ${file.FileName}:`, error.message);
    }
};

/**
 * دالة لتحديث البيانات المحلية باستخدام ملف manifest.json من المستودع
 */
const updateLocalData = async () => {
    try {
        // جلب ملف manifest.json من المستودع
        const response = await fetch(manifestURL);
        const manifest = await response.json();

        // حفظ ملف manifest.json محليًا إذا لم يكن موجودًا
        if (!fs.existsSync(manifestLocalFilePath)) {
            fs.writeFileSync(manifestLocalFilePath, JSON.stringify(manifest));
            console.log('تم حفظ ملف manifest.json محليًا');
        }

        // مقارنة الإصدارات المحلية بالإصدارات في manifest.json وتحديث البيانات إذا لزم الأمر
        for (const file of manifest.Files) {
            const localFilePath = path.join(localSrc, `${file.FilePath}/${file.FileName}`);
            const localFileVersion = fs.existsSync(localFilePath) ? getFileVersion(file) : '0.0';

            if (file.Version !== localFileVersion) {
                await downloadFile(file);
                updateManifestFile(file);
            }
        }
    } catch (error) {
        // التعامل مع أي أخطاء في عملية تحديث البيانات المحلية
        console.error('حدث خطأ أثناء تحديث البيانات المحلية:', error.message);
    }
};

/**
 * دالة للحصول على إصدار محدد لملف معين من الملفات المحلية
 * @param {object} file بيانات الملف المحدد
 * @returns {string} إصدار الملف المحدد
 */
const getFileVersion = (file) => {
    try {
        const manifest = fs.readFileSync(manifestLocalFilePath, 'utf8');
        const manifestJson = JSON.parse(manifest);
        const fileInManifest = manifestJson.Files.find(f => f.Id === file.Id && f.FileName === file.FileName);

        return fileInManifest ? fileInManifest.Version : '0.0';
    } catch (error) {
        // التعامل مع أي أخطاء في قراءة إصدار الملف
        console.error(`حدث خطأ أثناء قراءة إصدار الملف ${file.FileName}:`, error.message);
        return '0.0';
    }
};

/**
 * دالة لتحديث إصدار ملف محدد في ملف manifest.json المحلي
 * @param {object} updatedFile بيانات الملف المحدد المحدث
 */
const updateManifestFile = (updatedFile) => {
    try {
        const manifest = fs.readFileSync(manifestLocalFilePath, 'utf8');
        const manifestJson = JSON.parse(manifest);

        const { FileName, FilePath, Version } = updatedFile;
        const fileToUpdate = manifestJson.Files.find(file => file.FileName === FileName && file.FilePath === FilePath);

        if (fileToUpdate) {
            fileToUpdate.Version = Version;
        } else {
            console.warn(`الملف '${FileName}' غير موجود في الملف المحلي manifest.json`);
        }

        fs.writeFileSync(manifestLocalFilePath, JSON.stringify(manifestJson, null, 2));
        console.log('تم تحديث ملف manifest.json بنجاح');

    } catch (error) {
        // التعامل مع أي أخطاء في تحديث ملف manifest.json
        console.error('حدث خطأ أثناء تحديث ملف manifest.json:', error.message);
    }
};



export const syncData = async () => {
    // تنفيذ تحديث البيانات المحلية عند بدء تشغيل التطبيق
    await updateLocalData().catch(err => console.error('حدث خطأ: ', err));

    // تكرار تحديث البيانات المحلية كل ساعة
    const interval = 60 * 60 * 1000; // تحديد فاصل زمني بالميلي ثانية (ساعة واحدة)
    setInterval(async () => {
        try {
            await updateLocalData();
        } catch (err) {
            console.error('حدث خطأ: ', err);
        }
    }, interval);
}

export const dataCheck = async () => {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
            try {
                if (fs.existsSync(manifestLocalFilePath)) {

                    const manifest = await fs.promises.readFile(manifestLocalFilePath, 'utf8'); // تحديث استخدام fs.promises.readFile
                    const manifestJson = JSON.parse(manifest);
                    const lastFile = manifestJson?.Files?.[manifestJson?.Files?.length - 1];
                    const localFilePath = path.join(localSrc, `${lastFile.FilePath}/${lastFile.FileName}`);
                    const exists = fs.existsSync(localFilePath);

                    if (exists) {
                        clearInterval(intervalId);
                        resolve(true);
                    }
                }
            } catch (error) {
                clearInterval(intervalId);
                reject(error);
            }
        }, 5000);
    });
};
