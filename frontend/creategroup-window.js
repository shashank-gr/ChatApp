const chatBtn = document.querySelector("#contact-btn");
const groupBtn = document.querySelector("#group-btn");

const onChatClick = () => {
  console.log("clicked");
  window.location.href = "./chat-window.html";
};
onGroupBtnClick = () => {
  window.location.href = "./group-window.html";
};
chatBtn.addEventListener("click", onChatClick);
groupBtn.addEventListener("click", onGroupBtnClick);
