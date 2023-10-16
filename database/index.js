import { Sequelize, Model, DataTypes } from 'sequelize';
import model from './models.js';

// تهيئة اتصال قاعدة البيانات
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // اسم قاعدة البيانات
    logging: false
});
// النماذج | المواضيع والمستخدمين والتعليقات الخ
const modelObject = model(sequelize);

// اختبار اتصال قاعدة البيانات - Test database connection
try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

await sequelize?.sync().catch(error => console.error('حدث خطأ أثناء إنشاء الجداول:', error));

/**
 * وظيفة إزالة عامود من الجدول
 * @param {string} table
 * @param {string} attribute 
 */
async function removeColumn(table, attribute) {
    try {

        let queryInterface = sequelize.getQueryInterface();
        await queryInterface.removeColumn(table, attribute);
        console.log(`Column ${attribute} for table ${table} removed successfully`);
    } catch (error) {
        console.error('Error removing column:', error);
    }
}


/**
 * وظيفة إنشاء عامود جديد في الجدول
 * @param {string} table اسم العامود
 * @param {string} columnName اسم الجدول
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
        // Fetch topics from the database based on the provided category ID
        const topics = await modelObject.Topics.findAll({
            where: {
                category_id: categoryId
            },
            include: [
                {
                    model: modelObject.Users,
                    as: 'user'
                },
                {
                    model: modelObject.Comments,
                    as: 'comments',
                    attributes: [[sequelize.fn('COUNT', sequelize.col('comments.comment_id')), 'commentCount']]
                }
            ],
            group: ['Topics.topic_id', 'user.user_id']
        });

        // Map the retrieved data to the desired format
        const topicObjects = topics.map(topic => ({
            topic_id: topic.topic_id,
            category_id: topic.category_id,
            title: topic.title,
            description: topic.description,
            content: topic.content,
            type: topic.type,
            hide: topic.hide,
            images: topic.images ? topic.images : [],
            user: {
                user_id: topic.user.user_id,
                name: topic.user.name,
                username: topic.user.username,
                email: topic.user.email,
                profile: topic.user.profile
            },
            views: topic.views,
            likes: topic.likes,
            reports: topic.reports,
            favorites: topic.favorites,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
            commentCount: topic.comments[0]?.dataValues?.commentCount
        }));

        // Return the array of topic objects
        return topicObjects;
    } catch (error) {
        console.error('Error fetching topics:', error);
        return [];
    }
}

export { sequelize, removeColumn, addColumn, modelObject, getTopicsByCategoryId };