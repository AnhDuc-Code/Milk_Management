'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Carts.belongsTo(models.Products, { foreignKey: "product", targetKey: "idProduct" });
    }
  }
  Carts.init({
    // image: DataTypes.STRING,
    idCart: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user: DataTypes.STRING,
    product: DataTypes.INTEGER,
    numBuy: DataTypes.INTEGER,
    // category: DataTypes.STRING,
    // brand: DataTypes.STRING,
    // email: DataTypes.STRING,
    // quantity: DataTypes.SMALLINT.UNSIGNED,
  }, {
    sequelize,
    modelName: 'Carts',
    id: false,
    defaultScope: {  // Cấu hình mặc định cho mọi truy vấn
      attributes: { exclude: ['id'] }
    }
  });
  Carts.removeAttribute('id');
  return Carts;
};