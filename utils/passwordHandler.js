import bcrypt from 'bcrypt';

/**
 * تنفذ عمليات تشفير وفك تشفير ومقارنة كلمة المرور باستخدام bcrypt.
 * @param {string | { hashedPassword: string, plainPassword?: string }} password - كلمة المرور أو الهاش المخزن.
 * @param {'hash' | 'compare' | 'decrypt'} action - الإجراء المطلوب (تشفير، فك تشفير، أو مقارنة).
 * @returns {Promise<{ hashedPassword?: string, decryptedPassword?: boolean, isMatch?: boolean, error?: string }>} - كائن يحتوي على القيمة المطلوبة أو رسالة خطأ.
 */
export default async function passwordHandler(password, action) {
    // جدول الملح (salt) هو قيمة عشوائية تضاف إلى كلمة المرور قبل تشفيرها.
    const saltRounds = 10;

    if (action === 'hash') {
        if (typeof password !== 'string') {
            return { error: 'Invalid password' };
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return { hashedPassword };
    } else if (action === 'compare') {
        const { hashedPassword, plainPassword } = password;
        if (typeof hashedPassword !== 'string' || typeof plainPassword !== 'string') {
            return { error: 'Invalid password' };
        }
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return { isMatch };
    } else if (action === 'decrypt') {
        const { hashedPassword } = password;
        if (typeof hashedPassword !== 'string') {
            return { error: 'Invalid password' };
        }
        const decryptedPassword = await bcrypt.compare(hashedPassword, hashedPassword);
        return { decryptedPassword };
    } else {
        return { error: 'Invalid action' };
    }
}
