import { DataTypes } from 'sequelize';

function Statistics(sequelize) {
  return sequelize?.define('statistics', {
    stat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
}
export default Statistics;