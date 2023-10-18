import { DataTypes } from 'sequelize';

function Pdfs(sequelize) {
  return sequelize?.define('audios', {
    pdf_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pdf_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
export default Pdfs;
