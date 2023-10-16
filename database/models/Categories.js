import { DataTypes } from 'sequelize';

function Categories(sequelize) {
  return sequelize?.define('categories', {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
}

export default Categories;