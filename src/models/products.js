'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Products.belongsTo(models.Users, { foreignKey: "email", targetKey: "email" });
      Products.belongsTo(models.Stores, { foreignKey: "idStore", targetKey: "idStore" });
      Products.hasMany(models.Carts, { foreignKey: "product", sourceKey: "idProduct" });
      Products.hasOne(models.Bills, { foreignKey: "idProduct" });
    }
  }
  Products.init({
    idProduct: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.STRING,
    category: DataTypes.STRING,
    brand: DataTypes.STRING,
    idStore: DataTypes.INTEGER,
    quantity: DataTypes.SMALLINT.UNSIGNED,
  }, {
    sequelize,
    modelName: 'Products',
    id: false,
    defaultScope: {  // Cấu hình mặc định cho mọi truy vấn
      attributes: { exclude: ['id'] }
    }
  });
  Products.removeAttribute('id');
  return Products;
};