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


// جدول المشاركات
let Post = sequelize?.define('posts', {
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
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
    conten: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    keywords: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    link_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    link_source: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    comments: {
        type: DataTypes.TEXT, // نوع البيانات هنا هو ARRAY من نوع JSON,
        allowNull: true,
    },
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
    Post,
    removeColumn,
    addColumn
};