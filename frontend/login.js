const form = document.querySelector("form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const toast = document.querySelector(".toast-msg");

const loginUser = async (e) => {
  e.preventDefault();
  console.log(email.value, password.value);
  try {
    const data = {
      email: email.value,
      password: password.value,
    };
    const response = await axios.post("http://localhost:3000/user/login", data);
  } catch (error) {
    console.log(error);
    if (error.response.status == 400) {
      createToast(error.response.data.msg);
    } else if (error.response.status == 500) {
      createToast(error.response.data.msg);
    }
  }
};

form.addEventListener("submit", loginUser);
