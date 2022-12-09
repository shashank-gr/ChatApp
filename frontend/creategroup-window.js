const chatBtn = document.querySelector("#contact-btn");
const groupBtn = document.querySelector("#group-btn");
const createGrpName = document.querySelector("#create-groupname");
const grpNameAdd = document.querySelector("#create-groupname-user");
const grpNameAddUserMail = document.querySelector(
  "#create-groupname-useremail"
);
const radioTrue = document.querySelector("#admin-yes");
const radioFalse = document.querySelector("#admin-no");
const grpNameRemove = document.querySelector("#remove-groupname");
const grpNameEmailRemove = document.querySelector("#remove-email");
const usersBox = document.querySelector("#user-list");
const groupsBox = document.querySelector("#group-list");

axios.defaults.headers["Authorization"] = localStorage.getItem("userToken");

const createGroup = async (e) => {
  e.preventDefault();
  // console.log(createGrpName.value);
  try {
    const data = { groupName: createGrpName.value };
    const response = await axios.post(
      `http://localhost:3000/group/creategroup`,
      data
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
const addUserToGroup = async (e) => {
  try {
    e.preventDefault();
    const groupName = grpNameAdd.value;
    const userEmail = grpNameAddUserMail.value;
    const isAdmin = radioTrue.checked === true ? true : false;
    // console.log(groupName, userEmail);
    // console.log(isAdmin);
    const data = { groupName, email: userEmail, admin: isAdmin };
    const response = await axios.post(
      "http://localhost:3000/group/adduser",
      data
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
const removeFromGroup = async (e) => {
  try {
    e.preventDefault();
    const data = {
      groupName: grpNameRemove.value,
      email: grpNameEmailRemove.value,
    };
    const respone = await axios.post(
      "http://localhost:3000/group/deleteuser",
      data
    );
    console.log(respone);
  } catch (error) {
    console.log(error);
  }
};
const displayUser = ({ id, email }) => {
  const html = `<li class="list-group-item">${email} <input type='hidden' class='user-id' value='${id}' /></li>`;
  usersBox.insertAdjacentHTML("beforeend", html);
};
const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/group/allusers");
    // console.log(response);
    const users = response.data.users;
    // localStorage.setItem("users", JSON.stringify(users));
    users.forEach((user) => {
      displayUser(user);
    });
  } catch (error) {
    console.log(error);
  }
};
const displayGroup = ({ id, groupName }) => {
  const html = `<li class="list-group-item">${groupName} <input type='hidden' class='group-id' value='${id}' /></li>`;
  groupsBox.insertAdjacentHTML("beforeend", html);
};
const getGroups = async () => {
  try {
    const response = await axios.get("http://localhost:3000/group/allgroups");
    // console.log(response.data.groups);
    const groups = response.data.groups;
    // localStorage.setItem("users", JSON.stringify(users));
    groups.forEach((group) => {
      displayGroup(group);
    });
  } catch (error) {
    console.log(error);
  }
};
const onChatClick = () => {
  console.log("clicked");
  window.location.href = "./chat-window.html";
};
onGroupBtnClick = () => {
  window.location.href = "./group-window.html";
};
const onDOMLoaded = () => {
  getUsers();
  getGroups();
};

document.addEventListener("DOMContentLoaded", onDOMLoaded);
chatBtn.addEventListener("click", onChatClick);
groupBtn.addEventListener("click", onGroupBtnClick);
