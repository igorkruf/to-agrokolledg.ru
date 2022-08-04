console.log("подключили скрипты Админпанели");

let start = function () {
  //   ////////////////////////////////////////////////////////////////////////
  let test = document.querySelector("#test");
  let test_btn = document.querySelector("#test_btn");
  let formlogin__btn = document.querySelector(".formlogin__btn");
  //   console.log(formlogin__btn);
  formlogin__btn.addEventListener("click", async () => {
    console.log("loginform");
    let password = document.querySelector(".formlogin__input").value;
    console.log(password);
    let res = await fetch("/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let result = await fetch("/admin", {
      method: "GET",
    });
    let html = await result.text();
    document.write(html);
  });
};
//Запускаем функцию start только после того как браузер полностью построен DOM HTML страницы .
document.addEventListener("DOMContentLoaded", start);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
