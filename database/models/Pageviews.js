import { DataTypes } from 'sequelize';

function Pageviews(sequelize) {
  return sequelize?.define('pages-views', {
    view_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    PagePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browserInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    locationInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  });
}
export default Pageviews;