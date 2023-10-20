import { DataTypes } from 'sequelize';

function Views(sequelize) {
  return sequelize?.define('views', {
    view_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
}
export default Views;