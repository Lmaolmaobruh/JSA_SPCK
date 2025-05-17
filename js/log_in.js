// if (localStorage.getItem("currentUser")) {
//   location.href = "./index.html";
// }

function checkLogin(email, password) {
  if (!localStorage.getItem("users")) {
    return { success: false, message: "No user found" };
  }

  let users = JSON.parse(localStorage.getItem("users"));
  let existingUser = users.find(
    (user) => user.email === email.trim() && user.password === password.trim()
  );

  if (existingUser) {
    return { success: true, user: existingUser };
  } else {
    return { success: false, message: "Email or password is incorrect" };
  }
}

let form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.getElementById("email");
  let password = document.getElementById("password");

  const loginResult = checkLogin(email.value, password.value);

  if (loginResult.success) {
    localStorage.setItem("currentUser", JSON.stringify(loginResult.user));
    localStorage.setItem("isLoggedIn", "true");
    location.href = "../index.html";
  } else {
    alert(loginResult.message);
  }
});
