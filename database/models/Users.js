import { DataTypes } from 'sequelize';

function Users(sequelize) {
  return sequelize.define('users', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verification_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    update_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    telegram: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  });
}
export default Users;