import { DataTypes } from 'sequelize';

function Reports(sequelize) {
  return sequelize?.define('reports', {
    report_id: {
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
export default Reports;