const bcrypt = require("bcrypt");
const User = require("../model/user");
const saltRounds = 10;

exports.postRegister = (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !email || !phone || !password || phone.length != 10) {
    return res
      .status(400)
      .send({ msg: "Bad Parameters / all inputs are required" });
  }
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    try {
      if (err) {
        throw new Error();
      }
      const response = await User.create({
        name,
        phone,
        email,
        password: hash,
      });
      // console.log(response);
      res.status(201).send({ msg: "New user successfull registered" });
    } catch (error) {
      console.log(err);
      res.status(400).send({ msg: "User Already exists, try login" });
    }
  });
};
