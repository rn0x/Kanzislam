/**
 * تقوم الدالة بتحليل النص المدخل وإرجاع مجموعة من الإحصائيات المختلفة عن النص.
 * @param {string} text - النص المدخل للتحليل.
 * @returns {object} - كائن يحتوي على الإحصائيات المختلفة عن النص.
 */
export default function analyzeText(text) {
    // تحسين الأداء: التحقق من أن النص غير فارغ
    if (text.trim() === '') {
        return {
            characters: {
                description: "عدد الأحرف",
                value: 0
            },
            words: {
                description: "عدد الكلمات",
                value: 0
            },
            paragraphs: {
                description: "عدد الفقرات",
                value: 0
            },
            sentences: {
                description: "عدد الجمل",
                value: 0
            },
            charactersWithoutSpaces: {
                description: "الأحرف بدون مسافات",
                value: 0
            },
            uniqueWords: {
                description: "الكلمات الفريدة",
                value: []
            },
            words: {
                description: "الكلمات الدالة",
                value: []
            }
        };
    }

    // تحليل النص إلى جمل وفقرات وكلمات
    const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim() !== '');
    const paragraphs = text.split('\n').filter(paragraph => paragraph.trim() !== '');
    const words = text.split(/\s+/).filter(word => word.trim() !== '');

    // حساب الإحصائيات
    const characters = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;
    const uniqueWords = [...new Set(words)];

    // تحسين الأداء: حساب عدد مرات تكرار الكلمات
    const wordCounts = words.reduce((counts, word) => {
        const lowercaseWord = word.toLowerCase();
        counts[lowercaseWord] = (counts[lowercaseWord] || 0) + 1;
        return counts;
    }, {});

    // تحسين الأداء: الحصول على أول 15 كلمة دليلية من الأكثر تكرارًا إلى الأقل
    const topWords = Object.keys(wordCounts)
        .sort((a, b) => wordCounts[b] - wordCounts[a])
        .slice(0, 15);

    return {
        characters: {
            description: "عدد الأحرف",
            value: characters
        },
        words: {
            description: "عدد الكلمات",
            value: words.length
        },
        paragraphs: {
            description: "عدد الفقرات",
            value: paragraphs.length
        },
        sentences: {
            description: "عدد الجمل",
            value: sentences.length
        },
        charactersWithoutSpaces: {
            description: "الأحرف بدون مسافات",
            value: charactersWithoutSpaces
        },
        uniqueWords: {
            description: "الكلمات الفريدة",
            value: uniqueWords
        },
        words: {
            description: "الكلمات الدالة",
            value: topWords
        }
    }
}