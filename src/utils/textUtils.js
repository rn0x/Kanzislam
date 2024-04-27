import fs from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();

// دالة لإزالة كلمات التوقف من النص
export async function removeStopWords(text) {
    // const stopWords = ['في', 'على', 'من', 'إلى', 'هذا', 'هذه', 'ذلك', 'هنا', 'هناك', 'الخ'];
    const stopWordsPath = path.join(__dirname, 'public/json/stopWords.json');
    const stopWords = await fs.readJson(stopWordsPath).catch(() => ({}));
    const words = text.split(' ');
    const filteredWords = words.filter(word => !stopWords.includes(word));
    return filteredWords.join(' ');
}

// دالة لإزالة الحركات والعلامات التشكيلية العربية
export function removeArabicDiacritics(text) {
    const arabicDiacriticsRegex = /[\u064B-\u065F\u0610-\u061A\u06D8-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
    let cleanedText = text.replace(arabicDiacriticsRegex, '');
    cleanedText = cleanedText.replace(/أ/g, 'ا');
    cleanedText = cleanedText.replace(/إ/g, 'ا');
    cleanedText = cleanedText.replace(/آ/g, 'ا');
    cleanedText = cleanedText.replace(/ؤ/g, 'و');
    // حذف "ال" فقط إذا كان في بداية الكلمة
    cleanedText = cleanedText.replace(/(^|\s+)ال/g, '$1');
    return cleanedText;
}