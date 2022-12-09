const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Group = sequelize.define("group", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Group;
