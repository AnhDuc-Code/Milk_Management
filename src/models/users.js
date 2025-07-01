'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.belongsTo(models.Roles, { foreignKey: 'idRole' });
      // Users.hasMany(models.Products, { sourceKey: "email", foreignKey: "email" });
      Users.hasOne(models.Stores, { foreignKey: "idStore" });
      Users.hasMany(models.Orders, { foreignKey: "idUser", sourceKey: "idUser" });
    }
  }
  Users.init({
    idUser: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    idRole: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
    id: false,
    defaultScope: {  // Cấu hình mặc định cho mọi truy vấn
      attributes: { exclude: ['id'] }
    }
  });
  Users.removeAttribute('id');
  return Users;
};