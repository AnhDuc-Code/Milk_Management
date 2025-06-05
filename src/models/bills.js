'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bills.belongsTo(models.Products, { foreignKey: "product", targetKey: "idProduct" });
    }
  }
  Bills.init({
    // image: DataTypes.STRING,
    idBill: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idProduct: DataTypes.INTEGER,
    title: DataTypes.STRING,
    numBuy: DataTypes.INTEGER,
    price: DataTypes.STRING,
    totalPrice: DataTypes.STRING,
    email: DataTypes.STRING,
    // quantity: DataTypes.SMALLINT.UNSIGNED,
  }, {
    sequelize,
    modelName: 'Bills',
    id: false,
    defaultScope: {  // Cấu hình mặc định cho mọi truy vấn
      attributes: { exclude: ['id'] }
    }
  });
  Bills.removeAttribute('id');
  return Bills;
};