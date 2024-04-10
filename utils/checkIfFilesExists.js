import fs from 'fs-extra';

export default function checkFileExists(filePath) {
    try {
        // التحقق من وجود الملف
        fs.accessSync(filePath, fs.constants.F_OK);
        return true; // الملف موجود
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false; // الملف غير موجود
        } else {
            // معالجة أخطاء أخرى
            console.error('حدث خطأ أثناء التحقق من وجود الملف:', error.message);
            return false; // يمكنك تغيير هذا حسب حاجتك
        }
    }
}
