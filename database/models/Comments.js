import { DataTypes } from 'sequelize';

function Comments(sequelize) {
  return sequelize?.define('comments', {
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    images: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  });
}

export default Comments;