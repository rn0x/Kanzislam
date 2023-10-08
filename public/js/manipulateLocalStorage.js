/**
 * تنفذ الدالة عمليات معينة على localStorage بناءً على الإجراء المحدد.
 *
 * @param {"remove"|"get"|"set"} action - الإجراء المطلوب (remove, get, set).
 * @param {string} key - المفتاح المستخدم للوصول إلى العنصر في localStorage.
 * @param {string} value - القيمة المستخدمة في حالة الإجراء 'set'.
 * @returns {object} - كائن يحتوي على خصائص النتيجة (success, message, value).
 */

export default function manipulateLocalStorage(action, key, value) {
    let storage = window.localStorage;
    let result = {};

    if (action === 'remove') {
        storage.removeItem(key);
        result.success = true;
        result.message = `Successfully removed the item with key '${key}'.`;
    } else if (action === 'get') {
        let item = storage.getItem(key);
        if (item === null) {
            result.success = false;
            result.message = `The item with key '${key}' does not exist.`;
        } else {
            result.success = true;
            result.message = `Retrieved the item with key '${key}'.`;
            result.value = item;
        }
    } else if (action === 'set') {
        if (value === null) {
            result.success = false;
            result.message = `The value cannot be null.`;
        } else {
            storage.setItem(key, value);
            result.success = true;
            result.message = `Successfully set the item with key '${key}' to value '${value}'.`;
        }
    } else {
        result.success = false;
        result.message = 'Invalid action specified.';
    }

    return result;
}
