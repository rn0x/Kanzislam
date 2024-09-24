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
 * @returns {Promise<void>}
 */
const downloadFile = async (file) => {
    const filePath = path.join(localSrc, file.FilePath, file.FileName);
    try {
        const response = await fetch(`${Repo}/${file.FilePath}/${file.FileName}`);
        if (!response.ok) throw new Error(`فشل في تنزيل ${file.FileName}: ${response.statusText}`);

        const fileData = await response.arrayBuffer();

        // إنشاء المسار المحلي إذا لم يكن موجودًا
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, Buffer.from(fileData));
        console.log(`تم تنزيل ${file.FileName} بنجاح`);
    } catch (error) {
        console.error(`حدث خطأ أثناء تنزيل ${file.FileName}: ${error.message}`);
    }
};

/**
 * دالة لتحديث البيانات المحلية باستخدام ملف manifest.json من المستودع
 * @returns {Promise<void>}
 */
const updateLocalData = async () => {
    try {
        // جلب ملف manifest.json من المستودع
        const response = await fetch(manifestURL);
        if (!response.ok) throw new Error(`فشل في جلب manifest.json: ${response.statusText}`);

        const manifest = await response.json();

        // حفظ ملف manifest.json محليًا إذا لم يكن موجودًا
        if (!fs.existsSync(manifestLocalFilePath)) {
            fs.writeFileSync(manifestLocalFilePath, JSON.stringify(manifest, null, 2));
            console.log('تم حفظ ملف manifest.json محليًا');
        }

        // مقارنة الإصدارات المحلية بالإصدارات في manifest.json وتحديث البيانات إذا لزم الأمر
        for (const file of manifest.Files) {
            const localFilePath = path.join(localSrc, file.FilePath, file.FileName);
            const localFileVersion = fs.existsSync(localFilePath) ? getFileVersion(file) : '0.0';

            if (file.Version !== localFileVersion) {
                await downloadFile(file);
                updateManifestFile(file);
            }
        }
    } catch (error) {
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
        console.error(`حدث خطأ أثناء قراءة إصدار الملف ${file.FileName}: ${error.message}`);
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
            fs.writeFileSync(manifestLocalFilePath, JSON.stringify(manifestJson, null, 2));
            console.log('تم تحديث ملف manifest.json بنجاح');
        } else {
            console.warn(`الملف '${FileName}' غير موجود في الملف المحلي manifest.json`);
        }
    } catch (error) {
        console.error('حدث خطأ أثناء تحديث ملف manifest.json:', error.message);
    }
};

/**
 * دالة لفحص وجود الملفات المحلية وتحديثها عند الضرورة
 * @returns {Promise<boolean>} تعود بقيمة صحيحة إذا كانت الملفات موجودة ومحدثة
 */
const checkAndUpdateFiles = async () => {
    await updateLocalData();

    // تحقق من وجود ملفات محلية وإصداراتها
    const manifest = JSON.parse(fs.readFileSync(manifestLocalFilePath, 'utf8'));
    for (const file of manifest.Files) {
        const localFilePath = path.join(localSrc, file.FilePath, file.FileName);
        if (!fs.existsSync(localFilePath) || getFileVersion(file) !== file.Version) {
            return false; // إذا كانت هناك ملفات مفقودة أو غير محدثة
        }
    }
    return true; // كل شيء جيد
};

/**
 * دالة لبدء التطبيق والتحقق من وجود الملفات قبل التشغيل
 * @returns {Promise<void>}
 */
export const startApp = async () => {
    try {
        const filesAreUpdated = await checkAndUpdateFiles();
        if (filesAreUpdated) {
            console.log('جميع الملفات محدثة. بدء التطبيق...');
            // هنا يمكنك إضافة الكود لبدء التطبيق الفعلي
        } else {
            console.log('تحديث الملفات...');
            await updateLocalData();
        }
    } catch (error) {
        console.error('حدث خطأ أثناء بدء التطبيق:', error.message);
    }
};

// استدعاء startApp عند تشغيل التطبيق
startApp();