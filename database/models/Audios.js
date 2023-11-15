import { DataTypes } from 'sequelize';

function Audios(sequelize) {
  return sequelize?.define('audios', {
    audio_id: {
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
    audio_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
export default Audios;
