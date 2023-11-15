import { Sequelize, Model, DataTypes } from 'sequelize';
import model from './models.js';
import CreateCategories from '../modules/CreateCategories.js';

// تهيئة اتصال قاعدة البيانات
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // اسم قاعدة البيانات
    logging: false
});
// النماذج | المواضيع والمستخدمين والتعليقات الخ
const modelObject = model(sequelize);

/**
 * وظيفة إزالة عامود من الجدول
 * @param {string} table اسم الجدول
 * @param {string} attribute  اسم العامود
 */
async function removeColumn(table, attribute) {
    try {
        let queryInterface = sequelize.getQueryInterface();
        const tableExists = await queryInterface.showAllTables();
        if (tableExists.includes(table)) {
            const tableColumns = await queryInterface.describeTable(table);
            if (tableColumns.hasOwnProperty(attribute)) {
                await queryInterface.removeColumn(table, attribute);
                console.log(`Column ${attribute} for table ${table} removed successfully`);
            } else {
                console.error(`Column ${attribute} does not exist in table ${table}`);
            }
        } else {
            console.error(`Table ${table} does not exist`);
        }
    } catch (error) {
        console.error('Error removing column:', error);
    }
}


/**
 * وظيفة إنشاء عامود جديد في الجدول
 * @param {string} table اسم الجدول
 * @param {string} columnName اسم العامود
 * @param {"string" | "integer" | "boolean" | "date"} dataType 
 */

async function addColumn(table, columnName, dataType = "string") {
    try {

        let sequelizeDataType;
        if (dataType === 'string') {
            sequelizeDataType = DataTypes.STRING;
        } else if (dataType === 'integer') {
            sequelizeDataType = DataTypes.INTEGER;
        } else if (dataType === 'boolean') {
            sequelizeDataType = DataTypes.BOOLEAN;
        } else if (dataType === 'date') {
            sequelizeDataType = DataTypes.DATE;
        }
        let queryInterface = sequelize.getQueryInterface();
        await queryInterface.addColumn(table, columnName, {
            type: sequelizeDataType,
            allowNull: false // Set allowNull to false if the column cannot be null
        });
        console.log(`Column "${columnName}" added successfully with data type "${sequelizeDataType.key}"`);
    } catch (error) {
        console.error('Error adding column:', error);
    }
}


/**
 * استرجاع المواضيع من قاعدة البيانات بناءً على معرف الفئة المقدم.
 * @param {number} categoryId - معرف الفئة.
 * @returns {Promise<Array<Object>>} - وعد يحتوي على مصفوفة من كائنات المواضيع.
 * إذا حدث خطأ أثناء الاستعلام، سيتم إرجاع مصفوفة فارغة.
 */

async function getTopicsByCategoryId(categoryId) {
    try {
        const topicsData = await modelObject.Topics.findAll({
            where: {
                category_id: categoryId
            },
            include: [
                {
                    model: modelObject.Users,
                    as: 'users'
                }
            ]
        });

        const topics = await Promise.all(topicsData.map(async (topic) => {
            const commentsData = await modelObject.Comments.findAll({ where: { topic_id: topic.topic_id } });
            const likesData = await modelObject.Likes.findAll({ where: { topic_id: topic.topic_id } });
            const reportsData = await modelObject.Reports.findAll({ where: { topic_id: topic.topic_id } });
            const viewsData = await modelObject.Views.findAll({ where: { topic_id: topic.topic_id } }); // جلب بيانات المشاهدات

            return {
                topic_id: topic.topic_id,
                title: topic.title,
                user: {
                    user_id: topic.users.user_id,
                    name: topic.users.name,
                    username: topic.users.username,
                    profile: topic.users.profile
                },
                commentCount: commentsData.length,
                likeCount: likesData.length,
                reportCount: reportsData.length,
                viewCount: viewsData.length,
                createdAt: topic.createdAt,
                updatedAt: topic.updatedAt,
            };
        }));

        const categoryData = await modelObject.Categories.findOne({ where: { category_id: categoryId } });

        const category = {
            category_id: categoryData.category_id,
            category_name: categoryData.title,
            topics
        };

        return category;
    } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error);
        return [];
    }
}

/**
 * Fetches a topic and its associated data (comments, likes, reports, views, tags, categories) based on the topic title.
 * @param {string} categorie - The category of the topic.
 * @param {string} topic - The title of the topic.
 * @returns {Object} An object containing the topic and its associated data.
 * @throws {Error} If an error occurs during the fetching process.
 */
async function getTopicData(topic) {

    const { Topics, Comments, Users, Likes, Reports, Views, Tags, Categories } = modelObject;

    try {
        // Fetch the topic and its details
        const topicData = await Topics.findOne({
            where: { topic_id: topic },
            include: [
                {
                    model: Users,
                    as: 'users',
                    attributes: { exclude: ['email', 'password', 'token', "verification_code", "update_password"] }
                },
                { model: Categories, as: 'categories' }
            ],
        });

        if (!topicData) {
            return null; // If the topic is not found
        }

        // Fetch the comments in the topic
        const commentsData = await Comments.findAll({
            where: { topic_id: topicData.topic_id },
            include: [{
                model: Users,
                as: 'users',
                attributes: { exclude: ['email', 'password', 'token', "verification_code", "update_password"] }
            }],
        });

        // Fetch the likes, reports, views, and tags for the topic
        const likesData = await Likes.findAll({ where: { topic_id: topicData.topic_id } });
        const reportsData = await Reports.findAll({ where: { topic_id: topicData.topic_id } });
        const viewsData = await Views.findAll({ where: { topic_id: topicData.topic_id } });
        const tagsData = await Tags.findAll({ where: { topic_id: topicData.topic_id } });

        // Collect the data and return it
        const result = {
            topic: {
                ...topicData.dataValues,
                users: topicData.users.dataValues,
                categories: topicData.categories.dataValues
            },
            comments: commentsData.map(comment => ({ ...comment.dataValues, users: comment.users.dataValues })),
            likes: likesData.map(like => like.dataValues),
            reports: reportsData.map(report => report.dataValues),
            views: viewsData.map(view => view.dataValues)?.length,
            tags: tagsData.map(tag => tag.dataValues)?.[0],
        };

        return result;
    } catch (error) {
        console.error('An error occurred while fetching the topic and comments:', error);
        throw error;
    }
}

/**
 * تقوم بحذف الموضوع مع جميع البيانات المرتبطة به مثل الإعجابات والمشاهدات والبلاغات والتاجات والتعليقات.
 * @param {number} topicId - معرف الموضوع الذي يجب حذفه.
 * @param {number} userId - معرف المستخدم الذي يقوم بحذف الموضوع.
 * @returns {Promise<{ isDeleted: boolean, message: string }>} - كائن يحتوي على خاصيتين: isDeleted تحمل قيمة true إذا تم حذف الموضوع بنجاح و false إذا لم يتم الحذف، و message تحمل رسالة توضح نتيجة عملية الحذف.
 * @throws {Error} - إذا حدث خطأ أثناء عملية الحذف أو إذا لم يكن المستخدم هو منشئ الموضوع.
 */
async function deleteTopic(topicId, userId) {
    /**
     * @typedef {Object} ModelObject
     * @property {Object} Topics - جدول المواضيع.
     * @property {Object} Comments - جدول التعليقات.
     * @property {Object} Likes - جدول الإعجابات.
     * @property {Object} Reports - جدول البلاغات.
     * @property {Object} Views - جدول المشاهدات.
     * @property {Object} Tags - جدول التاجات.
     */

    /** @type {ModelObject} */
    const { Topics, Comments, Likes, Reports, Views, Tags } = modelObject;

    try {
        // Check if the user is the creator of the topic
        const topic = await Topics.findOne({ where: { topic_id: topicId, user_id: userId } });
        if (!topic) {
            return { isDeleted: false, message: 'You are not authorized to delete this topic' };
        }

        // Delete likes
        await Likes.destroy({ where: { topic_id: topicId } });

        // Delete views
        await Views.destroy({ where: { topic_id: topicId } });

        // Delete reports
        await Reports.destroy({ where: { topic_id: topicId } });

        // Delete tags
        await Tags.destroy({ where: { topic_id: topicId } });

        // Delete comments
        await Comments.destroy({ where: { topic_id: topicId } });

        // Delete the topic itself
        await Topics.destroy({ where: { topic_id: topicId } });

        console.log('Topic and associated data deleted successfully');

        return { isDeleted: true, message: 'Topic and associated data deleted successfully' };
    } catch (error) {
        console.error('Error deleting topic and associated data:', error);
        return { isDeleted: false, message: 'Error deleting topic and associated data' };
    }
}

/**
 * استرجاع العلامات (Tags) والمواضيع (Topics) ذات الصلة بها.
 *
 * @async
 * @function
 * @param {string} action - الإجراء المراد القيام به. يجب أن يكون "search" أو "get".
 * @param {string} searchKeyword - الكلمة المفتاحية المستخدمة في البحث عن العلامات.
 * @returns {Promise<Object>} إشعار يحتوي على معلومات العلامات والمواضيع ذات الصلة.
 * @throws {Error} إذا تم تقديم إجراء غير مدعوم.
 *
 * @example
 * // لاسترجاع جميع العلامات والمواضيع ذات الصلة
 * const result = await getAllTags("get");
 *
 * @example
 * // للبحث عن العلامات التي تحتوي على كلمة مفتاحية معينة
 * const result = await getAllTags("search", "علامة مفتاحية");
 */
async function getAllTags(action, searchKeyword) {
    try {
        const allTags = await modelObject.Tags.findAll();

        const uniqueTags = new Set();
        const tagsWithRelatedTopics = {};
        let isFindKeyword = false;

        for (const tagRecord of allTags) {
            const tagNames = tagRecord.tag_name;

            for (const tagName of tagNames) {
                if (!uniqueTags.has(tagName)) {
                    uniqueTags.add(tagName);
                }

                if (!tagsWithRelatedTopics[tagName]) {
                    tagsWithRelatedTopics[tagName] = [];
                }

                // ابحث عن المواضيع المرتبطة بالتاق في جدول Topics
                const relatedTopics = await modelObject.Topics.findAll({
                    where: {
                        topic_id: tagRecord.topic_id
                    }
                });

                tagsWithRelatedTopics[tagName].push(...relatedTopics);

                if (action === "search" && searchKeyword && tagName.includes(searchKeyword)) {
                    isFindKeyword = true;
                }
            }
        }

        if (action === "search" && searchKeyword) {
            const filteredTags = Array.from(uniqueTags).filter(tagName => tagName.includes(searchKeyword));
            const filteredTopics = {};

            for (const tagName of filteredTags) {
                const topicsWithViewsAndComments = await Promise.all(tagsWithRelatedTopics[tagName].map(async (topic) => {
                    const topicId = topic.topic_id;

                    // ابحث عن عدد المشاهدات وعدد التعليقات للموضوع
                    const topicViews = await modelObject.Views.findAll({
                        where: { topic_id: topicId }
                    });
                    const topicComments = await modelObject.Comments.findAll({
                        where: { topic_id: topicId }
                    });

                    return {
                        ...topic.toJSON(),
                        views: topicViews ? topicViews?.length : 0, // إرجاع القيمة الافتراضية إذا لم تجد
                        comments: topicComments ? topicComments?.length : 0, // إرجاع القيمة الافتراضية إذا لم تجد
                        content: undefined,
                        content_raw: undefined,
                        description: undefined,
                    };
                }))
                filteredTopics[tagName] = topicsWithViewsAndComments;
            }

            return {
                uniqueTags: filteredTags,
                tagsWithRelatedTopics: filteredTopics,
                isFindKeyword
            };
        } else if (action === "get") {
            const tagsWithViewsAndComments = {};

            // قم بإضافة المشاهدات والتعليقات لكل موضوع ذي علاقة بالتاق
            for (const tagName of uniqueTags) {
                tagsWithViewsAndComments[tagName] = await Promise.all(tagsWithRelatedTopics[tagName].map(async topic => {
                    const topicId = topic.topic_id;

                    // ابحث عن عدد المشاهدات وعدد التعليقات للموضوع
                    const topicViews = await modelObject.Views.findAll({
                        where: { topic_id: topicId }
                    });
                    const topicComments = await modelObject.Comments.findAll({
                        where: { topic_id: topicId }
                    });

                    return {
                        ...topic.toJSON(),
                        views: topicViews ? topicViews?.length : 0,
                        comments: topicComments ? topicComments?.length : 0,
                        content: undefined,
                        content_raw: undefined,
                        description: undefined,
                    };
                }));
            }

            return {
                uniqueTags: Array.from(uniqueTags),
                tagsWithRelatedTopics: tagsWithViewsAndComments, // استخدام البيانات التي تم إضافة المشاهدات والتعليقات لها
                isFindKeyword
            };
        } else {
            throw new Error("الإجراء غير مدعوم");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}



async function main() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync();
        console.log('Tables created successfully.');

        // إنشاء فئات المجتمع بعد تأكيد إنشاء الجداول
        await CreateCategories(modelObject.Categories);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


await main();

export {
    sequelize,
    removeColumn,
    addColumn,
    modelObject,
    getTopicsByCategoryId,
    getTopicData,
    deleteTopic,
    getAllTags
};