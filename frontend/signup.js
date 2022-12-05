const form = document.querySelector("form");
const userName = document.querySelector("#name");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const registerUser = async (e) => {
  e.preventDefault();
  console.log(userName.value, phone.value, email.value, password.value);
  try {
    const data = {
      name: userName.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
    };
    const response = await axios.post(
      "http://localhost:3000/user/register",
      data
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

form.addEventListener("submit", registerUser);
