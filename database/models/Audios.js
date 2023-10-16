import { DataTypes } from 'sequelize';

function Audios(sequelize) {
  return sequelize?.define('audios', {
    audio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    audio_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
export default Audios;
