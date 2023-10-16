import { DataTypes } from 'sequelize';

function Images(sequelize) {
    return sequelize?.define('images', {
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
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
}
export default Images;