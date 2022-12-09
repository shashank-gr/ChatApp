const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const userRoute = require("./router/user");
const chatRoute = require("./router/chat");
const groupRoute = require("./router/group");
const User = require("./model/user");
const Chat = require("./model/chat");
const Group = require("./model/group");
const Groupmessage = require("./model/groupmessage");
const Usergroup = require("./model/usergroup");
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/group", groupRoute);
app.use((req, res) => {
  // console.log(req.body);
  res.status(404).send("<h1>Page not found</h1>");
});

//one to many
User.hasMany(Chat);
Chat.belongsTo(User);
//many to many
User.belongsToMany(Group, { through: Usergroup });
Group.belongsToMany(User, { through: Usergroup });
//one to Many;
User.hasMany(Groupmessage);
Groupmessage.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log("Sequelize sync failed");
    console.log(err);
  });
