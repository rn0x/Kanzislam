import { DataTypes } from 'sequelize';

function Topics(sequelize) {
  return sequelize?.define('topics', {
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
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
    content_raw: {
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
      defaultValue: false
    },
    images: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  });
}
export default Topics;