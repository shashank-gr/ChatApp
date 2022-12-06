const form = document.querySelector("form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const toast = document.querySelector(".toast-msg");

const createToast = (msg, color = "orangered") => {
  console.log("toast crated");
  const div = document.createElement("div");
  div.innerHTML = msg;
  div.style.backgroundColor = color;
  div.style.padding = "1rem 2rem";
  div.style.borderRadius = "4px";
  div.style.color = "#fff";
  toast.insertAdjacentElement("beforeend", div);
  setTimeout(() => {
    console.log("toast removed");
    div.remove();
  }, 5000);
};

const loginUser = async (e) => {
  e.preventDefault();
  // console.log(email.value, password.value);
  try {
    const data = {
      email: email.value,
      password: password.value,
    };
    const response = await axios.post("http://localhost:3000/user/login", data);
    console.log(response.data);
    localStorage.setItem("userToken", response.data.token);
    window.location.href = "./chat-window.html";
  } catch (error) {
    console.log(error);
    if (error.response.status == 400) {
      createToast(error.response.data.msg);
    } else if (error.response.status == 401) {
      createToast(error.response.data.msg);
    } else if (error.response.status == 404) {
      createToast(error.response.data.msg);
    } else if (error.response.status == 500) {
      createToast(error.response.data.msg);
    }
  }
};

form.addEventListener("submit", loginUser);
