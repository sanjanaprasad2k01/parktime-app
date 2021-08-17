const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Categories extends Model {}

Categories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category_abbr: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    parks_id: {
      type: DataTypes.INTEGER, 
      references: {
        model: "park",
        key: "id"
      }
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    modelName: 'categories'
  }
);

module.exports = Categories;