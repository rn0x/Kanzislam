import { DataTypes } from 'sequelize';

function Likes(sequelize) {
  return sequelize?.define('likes', {
    like_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
}

export default Likes;