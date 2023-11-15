import { DataTypes } from 'sequelize';

function Tags(sequelize) {
  return sequelize?.define('tags', {
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag_name: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  });
}
export default Tags;