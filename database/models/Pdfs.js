import { DataTypes } from 'sequelize';

function Pdfs(sequelize) {
  return sequelize?.define('audios', {
    pdf_id: {
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
    pdf_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
}
export default Pdfs;
