const sendBtn = document.querySelector("#btn-send-msg");
const chatMessages = document.querySelector("#chat-messages");
const textBox = document.querySelector("#input-msgbox");
const toast = document.querySelector(".toast-msg");
axios.defaults.headers["Authorization"] = localStorage.getItem("userToken");

const createToast = (msg, color = "orangered") => {
  // console.log("toast creted");
  const div = document.createElement("div");
  div.innerHTML = msg;
  div.style.backgroundColor = color;
  div.style.padding = "1rem 2rem";
  div.style.borderRadius = "4px";
  div.style.color = "#fff";
  toast.insertAdjacentElement("beforeend", div);
  setTimeout(() => {
    // console.log("toast removed");
    div.remove();
  }, 5000);
};

const addToChatCard = (name, text) => {
  const html = `<li class="list-group-item">${name}: ${text}</li>`;
  chatMessages.insertAdjacentHTML("beforeend", html);
  textBox.value = "";
};

const sendMsg = async (e) => {
  const text = textBox.value;
  if (!text) return createToast("Enter Message to be sent");
  try {
    const data = {
      chatMsg: text,
    };
    const response = await axios.post(
      "http://localhost:3000/chat/chatmessage",
      data
    );
    // console.log(respone);
    if (response.status == 200) {
      addToChatCard(response.data.userName, text);
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

const onPageLoaded = async () => {
  try {
    const response = await axios.get("http://localhost:3000/chat/allchats");
    if (response.status == 200) {
      const chats = response.data.chats;
      chats.forEach((chat) => {
        addToChatCard(response.data.userName, chat.chatMessage);
      });
      createToast(response.data.msg, "green");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status == 400) {
      createToast(error.response.data.msg);
    }
  }
};
sendBtn.addEventListener("click", sendMsg);
document.addEventListener("DOMContentLoaded", onPageLoaded);
