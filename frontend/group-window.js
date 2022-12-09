const chatBtn = document.querySelector("#contact-btn");
const sendBtn = document.querySelector("#btn-send-msg");
const createGroupBtn = document.querySelector("#create-group-btn");
const chatMessages = document.querySelector("#chat-messages");
const groupsBox = document.querySelector("#group-list");
const textBox = document.querySelector("#input-msgbox");
const groupMessages = document.querySelector("#group-messages");
const groupMessageHeader = document.querySelector("#message-card-header");
const toast = document.querySelector(".toast-msg");

axios.defaults.headers["Authorization"] = localStorage.getItem("userToken");

let groupId;

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
//to switch to contact chats
const onChatClick = () => {
  console.log("clicked");
  window.location.href = "./chat-window.html";
};
//to switch to group creation
const onCreateGroupBtnClick = () => {
  window.location.href = "./creategroup-window.html";
};
//on group click getting the respective group messages
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
//sending a message to group
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
//to add group message to message box
const addToGroupCard = ({ message, userName }) => {
  const html = `<li class="list-group-item">${userName}: ${message}</li>`;
  groupMessages.insertAdjacentHTML("beforeend", html);
};
//to find all the group messages which are associated with the group
const getGroupMessages = async (toGroupId = 0) => {
  try {
    if (toGroupId == 0) return;
    groupMessages.innerHTML = "";
    const response = await axios.get(
      `http://localhost:3000/group/allgroupmessages/${toGroupId}`
    );
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
      createToast(error.response.data.msg);
    }
  }
};
//to display each group in group box
const displayGroup = ({ id, groupName }) => {
  const html = `<li class="list-group-item" style='cursor:pointer;'>${groupName} <input type='hidden' class='group-id' value='${id}' /></li>`;
  groupsBox.insertAdjacentHTML("beforeend", html);
};
//to find all the groups which are associated with the user
const getGroups = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/group/allusergroups"
    );
    const groups = response.data.userGroups;
    groups.forEach((group) => {
      displayGroup(group);
    });
  } catch (error) {
    console.log(error);
    if (error.response.status == 500) {
      createToast(error.response.data.msg);
    }
  }
};
//on DOM loaded
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
