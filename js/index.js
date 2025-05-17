window.addEventListener("DOMContentLoaded", function() {
  // KHÔNG xóa currentUser và isLoggedIn khi vào trang
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const signUpBtn = document.querySelector('.btn.btn-primary');
  const logInBtn = document.querySelector('.btn.btn-secondary');
  if (isLoggedIn) {
    if (signUpBtn) signUpBtn.style.display = "none";
    if (logInBtn) logInBtn.style.display = "none";
  } else {
    if (signUpBtn) signUpBtn.style.display = "";
    if (logInBtn) logInBtn.style.display = "";
  }
});