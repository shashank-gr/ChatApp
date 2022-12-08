const chatBtn = document.querySelector("#contact-btn");
const createGroupBtn = document.querySelector("#create-group-btn");

const onChatClick = () => {
  console.log("clicked");
  window.location.href = "./chat-window.html";
};
onCreateGroupBtnClick = () => {
  window.location.href = "./creategroup-window.html";
};
chatBtn.addEventListener("click", onChatClick);
createGroupBtn.addEventListener("click", onCreateGroupBtnClick);
