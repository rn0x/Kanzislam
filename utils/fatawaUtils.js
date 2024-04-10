/**
 * ترجع جميع الفئات المتواجدة في مصفوفة الفتاوى بدون تكرارات.
 * @param {Array<Object>} fatawaArray - مصفوفة الفتاوى التي يتم استخدامها لاسترداد الفئات.
 * @returns {Array<string>} - مصفوفة تحتوي على جميع الفئات الموجودة بدون تكرار.
 */
function getAllCategories(fatawaArray) {
    let allCategories = [];
    fatawaArray.forEach(fatwa => {
        allCategories = allCategories.concat(fatwa.categories);
    });
    // استخدام Set لإزالة التكرارات وإعادة التحويل إلى مصفوفة
    return Array.from(new Set(allCategories));
}

/**
 * ترجع مصفوفة تحتوي على أسماء الفئات مع عدد المواضيع المرتبطة بها.
 * @param {Array<Object>} fatawaArray - مصفوفة الفتاوى التي تحتوي على البيانات.
 * @returns {Array<Object>} - مصفوفة تحتوي على كائنات تمثل كل فئة مع عدد المواضيع المرتبطة بها.
 * @throws {Error} - في حالة عدم توفر مصفوفة الفتاوى أو حدوث خطأ أثناء معالجة البيانات. 
*/
function getCategorysWithCounts(fatawaArray) {
    if (!Array.isArray(fatawaArray)) {
        throw new Error('مصفوفة الفتاوى غير صالحة.');
    }
    const categoryCounts = new Map();
    // تجميع الفتاويات بناءً على الفئات
    fatawaArray.forEach(fatwa => {
        fatwa.categories.forEach(category => {
            if (categoryCounts.has(category)) {
                categoryCounts.set(category, categoryCounts.get(category) + 1);
            } else {
                categoryCounts.set(category, 1);
            }
        });
    });
    // تحويل الخريطة إلى مصفوفة من الأزواج { category, numberOfFatwas }
    const categoriesWithCounts = Array.from(categoryCounts, ([category, numberOfFatwas]) => ({ category, numberOfFatwas }));
    return categoriesWithCounts;
}

/**
 * ترجع جميع الفتاوى التي تنتمي إلى فئة محددة.
 * @param {Array<Object>} fatawaArray - مصفوفة الفتاوى التي يتم البحث فيها.
 * @param {string} targetCategory - الفئة المستهدفة لاسترجاع الفتاوى المرتبطة بها.
 * @returns {Array<Object>} - مصفوفة تحتوي على جميع الفتاوى المنتمية إلى الفئة المحددة.
 */
function getFatwasForCategory(fatawaArray, targetCategory) {
    return fatawaArray.filter(fatwa => fatwa.categories.includes(targetCategory));
}

/**
 * ترجع الفتوى الموجودة في مصفوفة الفتاوى بناءً على المعرف (ID).
 * @param {Array<Object>} fatawaArray - مصفوفة الفتاوى التي يتم البحث فيها.
 * @param {string|number} fatwaId - المعرف (ID) للفتوى المطلوبة.
 * @returns {Object|null} - الفتوى المطلوبة إذا تم العثور عليها، أو قيمة null إذا لم يتم العثور عليها.
 */

function getFatwaById(fatawaArray, fatwaId) {
    const fatwaMap = new Map(fatawaArray.map(fatwa => [fatwa.id.toString(), fatwa]));

    // البحث عن الفتوى باستخدام المعرف (ID) كمفتاح في الخريطة
    return fatwaMap.get(fatwaId.toString()) || null;
}

// تصدير الدوال للاستخدام في سياق آخر
export {
    getAllCategories,
    getCategorysWithCounts,
    getFatwasForCategory,
    getFatwaById
};
