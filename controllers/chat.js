exports.postChatMessage = async (req, res) => {
  try {
    const { chatMsg } = req.body;
    // console.log(chatMsg);
    if (!chatMsg) return res.status(400).send({ msg: "Please enter message" });
    const response = await req.user.createChat({ chatMessage: chatMsg });
    // console.log(response);
    res
      .status(200)
      .send({ userName: req.user.name, msg: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
