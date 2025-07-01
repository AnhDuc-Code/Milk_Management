'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stores.belongsTo(models.Users, { foreignKey: "idStore" });
      // Stores.hasMany(models.Products, { foreignKey: "product", sourceKey: "idProduct" });
      Stores.hasMany(models.Products, { sourceKey: "idStore", foreignKey: "idStore" });
      Stores.hasMany(models.Orders, { foreignKey: "idStore", sourceKey: "idStore" });
    }
  }
  Stores.init({
    idStore: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    storeName: DataTypes.STRING,
    taxCode: DataTypes.STRING,
    addressStore: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Stores',
    id: false,
    defaultScope: {  // Cấu hình mặc định cho mọi truy vấn
      attributes: { exclude: ['id'] }
    }
  });
  Stores.removeAttribute('id');
  return Stores;
};