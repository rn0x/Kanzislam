/**
 * تقوم الدالة بتحليل النص المدخل وإرجاع مجموعة من الإحصائيات المختلفة عن النص.
 * @param {string} text - النص المدخل للتحليل.
 * @returns كائن يحتوي على الإحصائيات المختلفة عن النص.
 */
export default function analyzeText(text) {
    // تحسين الأداء: التحقق من أن النص غير فارغ
    if (text?.trim() === '') {
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
    const stopWords = [
        "،",
        "ّآض",
        "آمينَ",
        "آه",
        "آهاً",
        "آي",
        "أ",
        "أب",
        "أجل",
        "أجمع",
        "أخ",
        "أخذ",
        "أصبح",
        "أضحى",
        "أقبل",
        "أقل",
        "أكثر",
        "ألا",
        "أم",
        "أما",
        "أمامك",
        "أمامكَ",
        "أمسى",
        "أمّا",
        "أن",
        "أنا",
        "أنت",
        "أنتم",
        "أنتما",
        "أنتن",
        "أنتِ",
        "أنشأ",
        "أنّى",
        "أو",
        "أوشك",
        "أولئك",
        "أولئكم",
        "أولاء",
        "أولالك",
        "أوّهْ",
        "أي",
        "أيا",
        "أين",
        "أينما",
        "أيّ",
        "أَنَّ",
        "أََيُّ",
        "أُفٍّ",
        "إذ",
        "إذا",
        "إذاً",
        "إذما",
        "إذن",
        "إلى",
        "إليكم",
        "إليكما",
        "إليكنّ",
        "إليكَ",
        "إلَيْكَ",
        "إلّا",
        "إمّا",
        "وإن",
        "إن",
        "إنّما",
        "إي",
        "إياك",
        "إياكم",
        "إياكما",
        "إياكن",
        "إيانا",
        "إياه",
        "إياها",
        "إياهم",
        "إياهما",
        "إياهن",
        "إياي",
        "إيهٍ",
        "إِنَّ",
        "ا",
        "ابتدأ",
        "اثر",
        "اجل",
        "احد",
        "اخرى",
        "اخلولق",
        "اذا",
        "اربعة",
        "ارتدّ",
        "استحال",
        "اطار",
        "اعادة",
        "اعلنت",
        "اف",
        "اكثر",
        "اكد",
        "الألاء",
        "الألى",
        "الا",
        "الاخيرة",
        "الان",
        "الاول",
        "الاولى",
        "التى",
        "التي",
        "الثاني",
        "الثانية",
        "الذاتي",
        "الذى",
        "الذي",
        "الذين",
        "السابق",
        "الف",
        "اللائي",
        "اللاتي",
        "اللتان",
        "اللتيا",
        "اللتين",
        "اللذان",
        "اللذين",
        "اللواتي",
        "الماضي",
        "المقبل",
        "الوقت",
        "الى",
        "اليوم",
        "اما",
        "امام",
        "امس",
        "ان",
        "انبرى",
        "انقلب",
        "انه",
        "انها",
        "او",
        "اول",
        "اي",
        "ايار",
        "ايام",
        "ايضا",
        "ب",
        "بات",
        "باسم",
        "بان",
        "بخٍ",
        "برس",
        "بسبب",
        "بسّ",
        "بشكل",
        "بضع",
        "بطآن",
        "بعد",
        "بعض",
        "بك",
        "بكم",
        "بكما",
        "بكن",
        "بل",
        "بلى",
        "بما",
        "بماذا",
        "بمن",
        "بن",
        "بنا",
        "به",
        "بها",
        "بي",
        "بيد",
        "بين",
        "بَسْ",
        "بَلْهَ",
        "بِئْسَ",
        "تانِ",
        "تانِك",
        "تبدّل",
        "تجاه",
        "تحوّل",
        "تلقاء",
        "تلك",
        "تلكم",
        "تلكما",
        "تم",
        "تينك",
        "تَيْنِ",
        "تِه",
        "تِي",
        "ثلاثة",
        "ثم",
        "ثمّ",
        "ثمّة",
        "ثُمَّ",
        "جعل",
        "جلل",
        "جميع",
        "جير",
        "حار",
        "حاشا",
        "حاليا",
        "حاي",
        "حتى",
        "حرى",
        "حسب",
        "حم",
        "حوالى",
        "حول",
        "حيث",
        "حيثما",
        "حين",
        "حيَّ",
        "حَبَّذَا",
        "حَتَّى",
        "حَذارِ",
        "خلا",
        "خلال",
        "دون",
        "دونك",
        "ذا",
        "ذات",
        "ذاك",
        "ذانك",
        "ذانِ",
        "ذلك",
        "ذلكم",
        "ذلكما",
        "ذلكن",
        "ذو",
        "ذوا",
        "ذواتا",
        "ذواتي",
        "ذيت",
        "ذينك",
        "ذَيْنِ",
        "ذِه",
        "ذِي",
        "راح",
        "رجع",
        "رويدك",
        "ريث",
        "رُبَّ",
        "زيارة",
        "سبحان",
        "سرعان",
        "سنة",
        "سنوات",
        "سوف",
        "سوى",
        "سَاءَ",
        "سَاءَمَا",
        "شبه",
        "شخصا",
        "شرع",
        "شَتَّانَ",
        "صار",
        "صباح",
        "صفر",
        "صهٍ",
        "صهْ",
        "ضد",
        "ضمن",
        "طاق",
        "طالما",
        "طفق",
        "طَق",
        "ظلّ",
        "عاد",
        "عام",
        "عاما",
        "عامة",
        "عدا",
        "عدة",
        "عدد",
        "عدم",
        "عسى",
        "عشر",
        "عشرة",
        "علق",
        "على",
        "عليك",
        "عليه",
        "عليها",
        "علًّ",
        "عن",
        "عند",
        "عندما",
        "عوض",
        "عين",
        "عَدَسْ",
        "عَمَّا",
        "غدا",
        "غير",
        "ـ",
        "ف",
        "فان",
        "فلان",
        "فو",
        "فى",
        "في",
        "فيم",
        "فيما",
        "فيه",
        "فيها",
        "قال",
        "قام",
        "قبل",
        "قد",
        "قطّ",
        "قلما",
        "قوة",
        "كأنّما",
        "كأين",
        "كأيّ",
        "كأيّن",
        "كاد",
        "كان",
        "كانت",
        "كذا",
        "كذلك",
        "كرب",
        "كل",
        "كلا",
        "كلاهما",
        "كلتا",
        "كلم",
        "كليكما",
        "كليهما",
        "كلّما",
        "كلَّا",
        "كم",
        "كما",
        "كي",
        "كيت",
        "كيف",
        "كيفما",
        "كَأَنَّ",
        "كِخ",
        "لئن",
        "لا",
        "لات",
        "لاسيما",
        "لدن",
        "لدى",
        "لعمر",
        "لقاء",
        "لك",
        "لكم",
        "لكما",
        "لكن",
        "لكنَّما",
        "لكي",
        "لكيلا",
        "للامم",
        "لم",
        "لما",
        "لمّا",
        "لن",
        "لنا",
        "له",
        "لها",
        "لو",
        "لوكالة",
        "لولا",
        "لوما",
        "لي",
        "لَسْتَ",
        "لَسْتُ",
        "لَسْتُم",
        "لَسْتُمَا",
        "لَسْتُنَّ",
        "لَسْتِ",
        "لَسْنَ",
        "لَعَلَّ",
        "لَكِنَّ",
        "لَيْتَ",
        "لَيْسَ",
        "لَيْسَا",
        "لَيْسَتَا",
        "لَيْسَتْ",
        "لَيْسُوا",
        "لَِسْنَا",
        "ما",
        "ماانفك",
        "مابرح",
        "مادام",
        "ماذا",
        "مازال",
        "مافتئ",
        "مايو",
        "متى",
        "مثل",
        "مذ",
        "مساء",
        "مع",
        "معاذ",
        "مقابل",
        "مكانكم",
        "مكانكما",
        "مكانكنّ",
        "مكانَك",
        "مليار",
        "مليون",
        "مما",
        "ممن",
        "من",
        "منذ",
        "منها",
        "مه",
        "مهما",
        "مَنْ",
        "مِن",
        "نحن",
        "نحو",
        "نعم",
        "نفس",
        "نفسه",
        "نهاية",
        "نَخْ",
        "نِعِمّا",
        "نِعْمَ",
        "ها",
        "هاؤم",
        "هاكَ",
        "هاهنا",
        "هبّ",
        "هذا",
        "هذه",
        "هكذا",
        "هل",
        "هلمَّ",
        "هلّا",
        "هم",
        "هما",
        "هن",
        "هنا",
        "هناك",
        "هنالك",
        "هو",
        "هي",
        "هيا",
        "هيت",
        "هيّا",
        "هَؤلاء",
        "هَاتانِ",
        "هَاتَيْنِ",
        "هَاتِه",
        "هَاتِي",
        "هَجْ",
        "هَذا",
        "هَذانِ",
        "هَذَيْنِ",
        "هَذِه",
        "هَذِي",
        "هَيْهَاتَ",
        "و",
        "وا",
        "واحد",
        "واضاف",
        "واضافت",
        "واكد",
        "وان",
        "واهاً",
        "واوضح",
        "وراءَك",
        "وفي",
        "وقال",
        "وقالت",
        "وقد",
        "وقف",
        "وكان",
        "وكانت",
        "ولا",
        "ولم",
        "ومن",
        "وهو",
        "وهي",
        "ويكأنّ",
        "وَيْ",
        "وُشْكَانََ",
        "يكون",
        "يمكن",
        "يوم",
        "فهذا",
        "ذلك",
        "لأن",
        "إليهما",
        "إليه",
        "عنه",
        "لا",
        "ولو",
        "إنما",
        "لهما",
        "ولكن",
        "ذلك",
        "آل",
        "يدل",
        "ّأيّان"
    ];
    // تحسين الأداء: الحصول على أول 15 كلمة دليلية من الأكثر تكرارًا إلى الأقل
    const topWords = Object.keys(wordCounts)
        .filter(word => !stopWords.includes(word))
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