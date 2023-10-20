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
        // Fetch topics from the database based on the provided category ID
        const topics = await modelObject.Topics.findAll({
            where: {
                category_id: categoryId
            },
            include: [
                {
                    model: modelObject.Users,
                    as: 'users'
                },
                {
                    model: modelObject.Comments,
                    as: 'comments',
                    attributes: [[sequelize.fn('COUNT', sequelize.col('comments.comment_id')), 'commentCount']]
                },
                {
                    model: modelObject.Categories,
                    as: 'categories'
                }
            ],
            group: ['Topics.topic_id', 'users.user_id', 'categories.category_id']
        });

        // Map the retrieved data to the desired format
        const topicObjects = topics.map(topic => ({
            topic_id: topic.topic_id,
            category_id: topic.category_id,
            category_name: topic.categories.title,
            title: topic.title,
            description: topic.description,
            content: topic.content,
            content_raw: topic.content_raw,
            type: topic.type,
            hide: topic.hide,
            user: {
                user_id: topic.users.user_id,
                name: topic.users.name,
                username: topic.users.username,
                profile: topic.users.profile
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

/**
 * Fetches a topic and its associated data (comments, likes, favorites, reports, views, tags, categories) based on the topic title.
 * @param {string} categorie - The category of the topic.
 * @param {string} topic - The title of the topic.
 * @returns {Object} An object containing the topic and its associated data.
 * @throws {Error} If an error occurs during the fetching process.
 */
async function getTopicData(topic) {

    const { Topics, Comments, Users, Likes, Favorites, Reports, Views, Tags, Categories } = modelObject;

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

        // Fetch the likes, favorites, reports, views, and tags for the topic
        const likesData = await Likes.findAll({ where: { topic_id: topicData.topic_id } });
        const favoritesData = await Favorites.findAll({ where: { topic_id: topicData.topic_id } });
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
            favorites: favoritesData.map(favorite => favorite.dataValues),
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




async function main() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync();
        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

await main();

export { sequelize, removeColumn, addColumn, modelObject, getTopicsByCategoryId, getTopicData };