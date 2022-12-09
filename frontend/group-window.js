const chatBtn = document.querySelector("#contact-btn");
const sendBtn = document.querySelector("#btn-send-msg");
const createGroupBtn = document.querySelector("#create-group-btn");
const chatMessages = document.querySelector("#chat-messages");
const groupsBox = document.querySelector("#group-list");
const textBox = document.querySelector("#input-msgbox");
const groupMessages = document.querySelector("#group-messages");
const groupMessageHeader = document.querySelector("#message-card-header");
let groupId;
axios.defaults.headers["Authorization"] = localStorage.getItem("userToken");

const onChatClick = () => {
  console.log("clicked");
  window.location.href = "./chat-window.html";
};
const onCreateGroupBtnClick = () => {
  window.location.href = "./creategroup-window.html";
};
const onGroupsClick = (e) => {
  if (e.target.className == "list-group-item") {
    const groupName = e.target.textContent;
    const id = +e.target.children[0].value;
    groupId = id;
    const html = `Message to Group: ${groupName} <input type='hidden' id='groupmsg-header-user-id' value='${id}'/>`;
    groupMessageHeader.innerHTML = html;
    groupMessages.innerHTML = "";
    getGroupMessages(id);
  }
};
const sendMsg = async (e) => {
  const text = textBox.value;
  const toGroup = +document.querySelector("#groupmsg-header-user-id").value;

  if (!text || !toGroup)
    return createToast("Choose the contact to whom message has to be sent");
  try {
    const data = {
      groupMessage: text,
      groupId: toGroup,
    };
    const response = await axios.post(
      `http://localhost:3000/group/sendgroupmessage`,
      data
    );
    if (response.status == 201) {
      textBox.value = "";
      getGroupMessages(groupId);
      // createToast(response.data.msg, "green");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status == 500) {
      // createToast(error.response.data.msg);
    }
  }
};
const addToGroupCard = ({ message, userName }) => {
  // console.log(chatMessage, name);
  const html = `<li class="list-group-item">${userName}: ${message}</li>`;
  groupMessages.insertAdjacentHTML("beforeend", html);
};
const getGroupMessages = async (toGroupId = 0) => {
  try {
    if (toGroupId == 0) return;
    groupMessages.innerHTML = "";
    const response = await axios.get(
      `http://localhost:3000/group/allgroupmessages/${toGroupId}`
    );
    // console.log(response);
    if (response.status == 200 && response.data.groupMessages) {
      const groupMsg = response.data.groupMessages;

      groupMsg.forEach((message) => {
        addToGroupCard(message);
      });
      // createToast(response.data.msg, "green");
    }
  } catch (error) {
    console.log(error);
    if (error.response.status == 500) {
      // createToast(error.response.data.msg);
    }
  }
};
const displayGroup = ({ id, groupName }) => {
  const html = `<li class="list-group-item" style='cursor:pointer;'>${groupName} <input type='hidden' class='group-id' value='${id}' /></li>`;
  groupsBox.insertAdjacentHTML("beforeend", html);
};
const getGroups = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/group/allusergroups"
    );
    // console.log(response);
    const groups = response.data.userGroups;
    groups.forEach((group) => {
      displayGroup(group);
    });
  } catch (error) {
    console.log(error);
  }
};

const onPageLoaded = () => {
  getGroups();
  setInterval(() => {
    getGroupMessages(groupId); //starting default will be 0
  }, 5000);
};

document.addEventListener("DOMContentLoaded", onPageLoaded);
chatBtn.addEventListener("click", onChatClick);
createGroupBtn.addEventListener("click", onCreateGroupBtnClick);
sendBtn.addEventListener("click", sendMsg);
groupsBox.addEventListener("click", onGroupsClick);
