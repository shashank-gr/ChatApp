const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const userRoute = require("./router/user");
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use((req, res) => {
  // console.log(req.body);
  res.status(404).send("<h1>Page not found</h1>");
});

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log("Sequelize sync failed");
    console.log(err);
  });
