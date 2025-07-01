'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orders.belongsTo(models.Products, { foreignKey: "idProduct", targetKey: "idProduct" });
      Orders.belongsTo(models.Users, { foreignKey: "idUser", targetKey: "idUser" });
      Orders.belongsTo(models.Stores, { foreignKey: "idStore", targetKey: "idStore" });
    }
  }
  Orders.init({
    // image: DataTypes.STRING,
    idOrder: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idUser: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    idStore: DataTypes.INTEGER,
    numBuy: DataTypes.INTEGER,
    totalPrice: DataTypes.INTEGER,
    state: DataTypes.STRING,
    // category: DataTypes.STRING,
    // brand: DataTypes.STRING,
    // email: DataTypes.STRING,
    // quantity: DataTypes.SMALLINT.UNSIGNED,
  }, {
    sequelize,
    modelName: 'Orders',
    id: false,
    defaultScope: {  // Cấu hình mặc định cho mọi truy vấn
      attributes: { exclude: ['id'] }
    }
  });
  Orders.removeAttribute('id');
  return Orders;
};