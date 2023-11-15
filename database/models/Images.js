import { DataTypes } from 'sequelize';

function Images(sequelize) {
    return sequelize?.define('images', {
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // اسم جدول المستخدمين
                key: 'user_id',
            },
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
}
export default Images;