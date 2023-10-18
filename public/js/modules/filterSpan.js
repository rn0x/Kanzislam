/**
 * تحويل الأرقام الإنجليزية إلى الأرقام العربية.
 * @param {string} match - الأرقام الإنجليزية التي ستتم تحويلها.
 * @returns {string} الأرقام العربية المحولة.
 */
const convertArabicNumbers = (match) => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return match.split('').map(digit => arabicNumerals[digit]).join('');
};

/**
 * استبدال كلمات معينة في جملة بالكلمات المشار إليها باللون الأحمر.
 * @param {string} sentence - الجملة التي ستتم معالجتها.
 * @returns {string} الجملة بعد استبدال الكلمات.
 */
function replaceWords(sentence) {
    const wordsToReplace = ['الله', 'لله', 'عز وجل', 'سبحانه وتعالى', 'رضي الله عنه', 'عليه السلام', 'ﷻ', 'ﷺ'];

    return sentence.split(' ').map(word => {
        let normalizedWord = word.normalize("NFD").replace(/[\u064B-\u0652]/g, "");
        for (let i = 0; i < wordsToReplace.length; i++) {
            let normalizedWordToReplace = wordsToReplace[i].normalize("NFD").replace(/[\u064B-\u0652]/g, "");
            if (normalizedWord === normalizedWordToReplace) {
                return `<span style="color: #fe3f3f;">${word}</span>`;
            }
        }
        return word;
    }).join(' ');
}

/**
 * تطبيق مجموعة من التحويلات على جملة، بما في ذلك تحويل الأرقام واستبدال كلمات معينة.
 * @param {string} sentence - الجملة التي ستتم معالجتها.
 * @returns {string} الجملة بعد تطبيق التحويلات.
 */
export default function filterSpan(sentence) {
    let newSentence = sentence
        .replace(/\d+/g, convertArabicNumbers)
        .replace(/\(/g, '<span style="color: #596aab;">(')
        .replace(/\)/g, ')</span>')
        .replace(/﴿/g, ' <span style="color: #378e48;">﴿')
        .replace(/﴾/g, '﴾</span>')
        .replace(/«/g, '<span style="color: #6bc077;">«')
        .replace(/»/g, '»</span>')
        .replace(/\[/g, '<span style="color: #59aba2;">[')
        .replace(/\]/g, ']</span>');

    return replaceWords(newSentence);
}