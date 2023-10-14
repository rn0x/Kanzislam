import { Sequelize, Model, DataTypes } from 'sequelize';

// تهيئة اتصال قاعدة البيانات
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // اسم قاعدة البيانات
    logging: false
});

// اختبار اتصال قاعدة البيانات
sequelize
    .authenticate()
    .then(() => {
        console.log('تم الاتصال بنجاح بقاعدة البيانات.');
    })
    .catch((error) => {
        console.error('حدث خطأ أثناء الاتصال بقاعدة البيانات:', error);
    });

// جدول المستخدمين
let User = sequelize?.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    verification_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    update_password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(), // تعيين الوقت الحالي كقيمة افتراضية
    },
    profile: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telegram: {
        type: DataTypes.JSON,
        allowNull: true
    },
    posts: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    likes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    videos: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, { createdAt: false, updatedAt: false });

// جدول فئات المجتمع
let Categories = sequelize?.define('categories', {
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
});


// جدول الموضوعات
let Topics = sequelize?.define('topics', {
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(), // تعيين الوقت الحالي كقيمة افتراضية
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    view: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    likes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

// جدول التعليقات
let Comments = sequelize?.define('comments', {
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_posted: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
    },
});

// جدول التاقات
let Tags = sequelize?.define('tags', {
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// جدول الإعجابات
let Likes = sequelize?.define('likes', {
    like_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// جدول المفضلة
let Favorites = sequelize?.define('favorites', {
    favorite_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// جدول البلاغات
let Reports = sequelize?.define('reports', {
    report_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});


// جدول المشاهدات
let Views = sequelize?.define('views', {
    view_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});


// جدول الإشعارات
let Notifications = sequelize?.define('notifications', {
    notification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    notification_text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


// جدول الصور
let Images = sequelize?.define('images', {
    image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// جدول الفيديو
let Videos = sequelize?.define('videos', {
    video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// جدول الصوت
let Audios = sequelize?.define('audios', {
    audio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    audio_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// جدول الإحصائيات
let Statistics = sequelize?.define('statistics', {
    stat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    views_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    likes_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comments_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});


sequelize?.sync()
    .then(() => {
        console.log('تم إنشاء الجداول بنجاح.');
    })
    .catch((error) => {
        console.error('حدث خطأ أثناء إنشاء الجداول:', error);
    });


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

export {
    sequelize,
    User,
    Topics,
    Comments,
    Tags,
    Likes,
    Favorites,
    Reports,
    Views,
    Notifications,
    Images,
    Videos,
    Audios,
    Statistics,
    removeColumn,
    addColumn
};