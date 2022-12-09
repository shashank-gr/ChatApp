const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Usergroup = sequelize.define("usergroup", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Usergroup;
