const sendBtn = document.querySelector("#btn-send-msg");
const chatMessages = document.querySelector("#chat-messages");
const messageHeader = document.querySelector("#message-card-header");
const usersBox = document.querySelector("#users-list");
const textBox = document.querySelector("#input-msgbox");
const toast = document.querySelector(".toast-msg");
axios.defaults.headers["Authorization"] = localStorage.getItem("userToken");

//to create toast messages
const createToast = (msg, color = "orangered") => {
  const div = document.createElement("div");
  div.innerHTML = msg;
  div.style.backgroundColor = color;
  div.style.padding = "1rem 2rem";
  div.style.borderRadius = "4px";
  div.style.color = "#fff";
  toast.insertAdjacentElement("beforeend", div);
  setTimeout(() => {
    div.remove();
  }, 2000);
};

const onUserClick = (e) => {
  if (e.target.className == "list-group-item") {
    //  console.log(e.target.children);
    const name = e.target.textContent;
    const id = +e.target.children[0].value;
    // console.log(name, id);
    const html = `Message to : ${name} <input type='hidden' id='msg-header-user-id' value='${id}'/>`;
    messageHeader.innerHTML = html;
    chatMessages.innerHTML = "";
    getChats(id);
  }
};

//to add the message to the cart
const addToChatCard = ({ chatMessage, user: { name } }) => {
  // console.log(chatMessage, name);
  const html = `<li class="list-group-item">${name}: ${chatMessage}</li>`;
  chatMessages.insertAdjacentHTML("beforeend", html);
};

//to send a single message
const sendMsg = async (e) => {
  const text = textBox.value;
  const toUser = +document.querySelector("#msg-header-user-id").value;

  if (!text || !toUser)
    return createToast("Choose the contact to whom message has to be sent");
  try {
    const data = {
      chatMsg: text,
      toUser,
    };
    const response = await axios.post(
      `http://localhost:3000/chat/chatmessage`,
      data
    );
    if (response.status == 200) {
      textBox.value = "";
      createToast(response.data.msg, "green");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status == 400) {
      createToast(error.response.data.msg);
    } else if (error.response.status == 500) {
      createToast(error.response.data.msg);
    }
  }
};

//to get all the chats
const getChats = async (toUserId = 0) => {
  try {
    chatMessages.innerHTML = "";
    const response = await axios.get(
      `http://localhost:3000/chat/allchats/${toUserId}`
    );
    // console.log(response);
    if (response.status == 200) {
      const chats = response.data.chats;

      chats.forEach((chat) => {
        addToChatCard(chat);
      });
      // createToast(response.data.msg, "green");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status == 400) {
      createToast(error.response.data.msg);
    } else if (error.response.status == 401) {
      createToast(error.response.data.msg);
    }
  }
};
//display users
const displayUser = ({ id, name }) => {
  const html = `<li class="list-group-item" style='cursor:pointer;'>${name} <input type='hidden' class='user-id' value='${id}' /></li>`;
  usersBox.insertAdjacentHTML("beforeend", html);
};
//get all users
const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/chat/allusers");
    // console.log(response);
    const users = response.data.users;
    users.forEach((user) => {
      displayUser(user);
    });
  } catch (error) {
    console.log(error);
  }
};
//refresh after every 3 seconds
const onPageLoaded = () => {
  // setInterval(() => {
  //   getChats();
  // }, 3000);
  getUsers();
  // getChats();
};

document.addEventListener("DOMContentLoaded", onPageLoaded);
sendBtn.addEventListener("click", sendMsg);
usersBox.addEventListener("click", onUserClick);
