const sendBtn = document.querySelector("#btn-send-msg");
const chatMessages = document.querySelector("#chat-messages");
const toast = document.querySelector(".toast-msg");
axios.defaults.headers.post["Authorization"] =
  localStorage.getItem("userToken");

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

const sendMsg = async (e) => {
  const textBox = document.querySelector("#input-msgbox");
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
      const html = `<li class="list-group-item">${response.data.userName}: ${text}</li>`;
      chatMessages.insertAdjacentHTML("beforeend", html);
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

sendBtn.addEventListener("click", sendMsg);
