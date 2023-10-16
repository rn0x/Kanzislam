import { DataTypes } from 'sequelize';

function Favorites(sequelize) {
  return sequelize?.define('favorites', {
    favorite_id: {
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
export default Favorites;