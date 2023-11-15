import { DataTypes } from 'sequelize';

function Videos(sequelize) {
  return sequelize?.define('videos', {
    video_id: {
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
    video_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
export default Videos;