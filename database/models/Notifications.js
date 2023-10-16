import { DataTypes } from 'sequelize';

function Notifications(sequelize) {
  return sequelize?.define('notifications', {
    notification_id: {
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
    notification_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
export default Notifications;