const { Op } = require("sequelize");
const Chat = require("../model/chat");
const User = require("../model/user");

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { id: { [Op.ne]: +req.user.id } },
      attributes: ["id", "name"],
    });
    res.status(200).send({ users, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
exports.getAllChats = async (req, res) => {
  const chatPersonId = +req.params.withUserId;
  if (chatPersonId == 0) return res.status(200).send({ msg: "success" });
  try {
    // const respone = await req.user.getChats({
    //   where: { toUser: chatPersonId },
    //   attributes: ["chatMessage"],
    // });
    const chats2way = await Chat.findAll({
      limit: 10,
      order: [["updatedAt", "DESC"]],
      where: {
        [Op.or]: [
          { toUser: chatPersonId, userId: +req.user.id },
          { toUser: +req.user.id, userId: chatPersonId },
        ],
      },
      attributes: ["chatMessage"],
      include: {
        model: User,
        where: {
          [Op.or]: [{ id: +req.user.id }, { id: chatPersonId }],
        },
        attributes: ["name"],
      },
    });

    // console.log(chats2way);
    res.status(200).send({ chats: chats2way.reverse(), msg: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

exports.postChatMessage = async (req, res) => {
  try {
    const { toUser, chatMsg } = req.body;
    // console.log(req.body);
    // console.log(chatMsg);
    if (!chatMsg) return res.status(400).send({ msg: "Please enter message" });
    const response = await req.user.createChat({
      chatMessage: chatMsg,
      toUser,
    });
    // console.log(response);
    res
      .status(200)
      .send({ userName: req.user.name, msg: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
