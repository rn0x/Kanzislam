import { DataTypes } from 'sequelize';

function Videos(sequelize) {
  return sequelize?.define('videos', {
    video_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
}
export default Videos;