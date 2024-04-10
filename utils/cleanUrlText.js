export default function cleanUrlText(text) {
    // Map for replacing Arabic characters with English equivalents
    const arabicToEnglishMap = {
        'ا': 'a', 'أ': 'a', 'إ': 'a', 'آ': 'a',
        'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
        'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh',
        'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
        'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
        'ع': 'e', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
        'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
        'ه': 'h', 'ة': 'h', 'و': 'o', 'ؤ': 'o',
        'ي': 'y', 'ئ': 'y', 'ى': 'a'
    };

    // Regular expression to remove diacritics (Tashkeel) from Arabic text
    const arabicDiacriticsRegex = /[\u064B-\u065F\u0670\u0610-\u061A]/g;
    // Remove diacritics from the text
    text = text.replace(arabicDiacriticsRegex, '');

    // Convert the text to lowercase for consistency
    text = text.toLowerCase();

    // Replace Arabic characters with their English equivalents
    text = text.replace(/[^\u0000-\u007E]/g, function (char) {
        return arabicToEnglishMap[char] || ''; // Use the corresponding English character if exists, otherwise empty string
    });

    // Replace spaces with underscores
    text = text.replace(/\s+/g, '_');
    text = text.replace(/\//g, '');
    text = text.replace(/:/g, '');
    text = text.replace(/&/g, '');

    // Remove any characters not allowed in URL paths
    text = text.replace(/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/g, '');

    // Remove parentheses and other unwanted symbols
    text = text.replace(/[(){}<>\[\]]+/g, '');

    return text;
}