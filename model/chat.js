const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Chat = sequelize.define("chat", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  chatMessage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Chat;
