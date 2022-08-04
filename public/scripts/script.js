console.log("подключили скрипты");
//Для всплывающих подсказок

let DateTime = luxon.DateTime;
let start = async function () {
  let logo = document.querySelector(".logo");
  logo.addEventListener("click", () => {
    window.location = "/";
  });
  let content = document.querySelector(".content");
  let tooltip = document.querySelector(".tooltip");
  ///////////////////////////////////////////////
  let wrapmodal = document.querySelector(".wrapmodal");
  wrapmodal.addEventListener("click", function (event) {
    console.log(event.target);
    this.classList.remove("visible");
  });
  let modal = document.querySelector(".modal");
  modal.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  //Закрытие по клику на крестике в модальном окне редактирования объявления
  let modalcloseeditnews = document.querySelector("#closenews");
  modalcloseeditnews.addEventListener("click", () => {
    wrapmodal.classList.remove("visible");
  });

  //предварительная запись
  let zapis = document.querySelector(".zapis");
  zapis.addEventListener("click", async () => {
    console.log("кликнули по предварительной записи");
    let response = await fetch("/registration", {
      method: "GET",
    });
    let result = await response.text();
    console.log(result);
    content.innerHTML = result;
    let tomainpage = document.querySelector(".to-main-page");
    tomainpage.addEventListener("click", () => {
      window.location = "/";
    });
    //Для сохранения выбранной даты и времени
    let idTimeRegistration = document.querySelector(".id-time-registration");
    let dateRegistration = document.querySelector(".date-registration");
    let fio = document.querySelector(".input__fio");
    let car = document.querySelector(".input__car");
    let email = document.querySelector(".input__e-mail");
    let tel = document.querySelector(".input__tel");
    //Для datepicker
    // //для выбора даты предварительной записи
    let inp = document.querySelector(".choiceDate");
    console.log(inp);
    minDate = new Date();
    maxDate = new Date();
    minDate.setDate(minDate.getDate() + 1); //увеличиваем на один день
    maxDate.setMonth(maxDate.getMonth() + 1); // увеличиваем текущую дату на 1 месяц

    const choiceDate = datepicker(inp, {
      startDay: 1,
      customDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      customMonths: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июнь",
        "Июль",
        "Авг",
        "Сен",
        "Окт ",
        "Ноя",
        "Дек",
      ],
      minDate: minDate,
      maxDate: maxDate,
      //   //   //   // formatter: (input, date, instance) => {
      //   //   //   //   const value = date;
      //   //   //   //   input.value = `${value.getDate()}-${value.getMonth()}-${value.getFullYear()}`; // => '1/1/2099'
      //   //   //   // },
      onSelect: async (instance, data) => {
        console.log(data);
        //Сохраняем выбранную дату в inpute type="hidden"
        dateRegistration.value = data;
        console.log(`выбранная дата: ${dateRegistration.value}`);
        // if (choiceDate.dateSelected) {
        let fio = document.querySelector(".input__fio");
        let registrationForm = document.querySelector(".registration");
        let registrationFormBtn = document.querySelector(
          ".registration-form__button"
        );
        registrationFormBtn.addEventListener("click", async () => {
          let message;
          if (fio.value == "") {
            console.log("Введи своё имя");
            fio.classList.add("input__fio_error");
            fio.focus();
            tooltip.classList.add("tooltip-error");
            message = "Введите своё имя";
            tooltip.innerHTML = message;
          } else {
            let response = await fetch("/registration", {
              method: "POST",
              body: JSON.stringify({
                fio: fio.value,
                car: car.value,
                date: dateRegistration.value,
                time: idTimeRegistration.value,
                // email: email.value,
                // tel: tel.value,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            window.location.href = "/";
          }
        });
        fio.addEventListener("input", function () {
          this.classList.remove("input__fio_error");
        });
        // const formatedDate = new Intl.DateTimeFormat("ru", {
        //   dateStyle: "long",
        // }).format(data);
        formatedDate = DateTime.fromJSDate(data)
          .setLocale("ru")
          .toFormat("cccc, dd LLL yyyy");

        let span = document.querySelector(".formateddate");

        span.innerHTML = formatedDate;
        console.log("выбрал дату");
        let response = await fetch("/choicedate", {
          method: "POST",
          body: JSON.stringify({ date: data }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        if (response.status == 200) {
          let choiceTime = document.querySelector(
            ".registration-form__choice-time"
          );
          let result = await response.text();
          choiceTime.innerHTML = result;
          let choiceTimeItem = document.querySelectorAll(
            ".registration-form__choice-time-item"
          );
          choiceTimeItem.forEach((elem) => {
            elem.addEventListener("click", function () {
              registrationFormBtn.classList.remove(
                "registration-form__button_disable"
              );
              choiceTimeItem.forEach((elem) => {
                elem.classList.add(
                  "registration-form__choice-time-item_enable"
                );
              });
              this.classList.remove(
                "registration-form__choice-time-item_enable"
              ); //делаем неактивное выбранное время
              idTimeRegistration.value = this.previousElementSibling.value; //Сохраняем выбранное время в inpute type="hidden"
              console.log(typeof idTimeRegistration.value);
            });
          });
        }
      },
    });
  });

  //intersection observe
  const optionsIORazdel = {
    rootMargin: "-100px",
    threshold: 0,
  };
  //Проверяем есть ли в базе объявления(при условии что куки с именем visited нет)
  //console.log(document.cookie);
  if (document.cookie.indexOf("visited") == -1) {
    let resGetListNews = await fetch("/listnews", {
      method: "GET",
    });
    let result = await resGetListNews.json();
    console.log(result);

    if (result.length > 0) {
      result.forEach((elem) => {
        let div = document.createElement("div");
        div.classList.add("itemsListNews");
        div.innerHTML = elem.textNew;
        modal.appendChild(div);
      });
      setTimeout(() => {
        wrapmodal.classList.add("visible");
        document.cookie = "visited=1";
      }, 1000);
    }
  }
  ////////////////////////////////////////////////////
  let razdel = function (entries, observerRazdel) {
    //entry- переводится как вход
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(entry.target);
        console.log("сроботало");
        entry.target.classList.remove("unvisible");
        let visibleRazdel = entry.target.dataset.razdel;
        let navLink = document.querySelector(
          `.nav__link[data-razdel="${visibleRazdel}"]`
        );
        activatedNavLink(navLink);
      }
    });
  };
  let observerRazdel = new IntersectionObserver(razdel, optionsIORazdel);

  razdels.forEach((elem) => {
    observerRazdel.observe(elem);
  });
};
//Запускаем функцию start только после того как браузер полностью построен DOM HTML страницы .
document.addEventListener("DOMContentLoaded", start);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// //прокрутка по клику на пункт меню до раздела с data-razdel=""
// function scrollingtorazdel(namerazdel) {
//   console.log(namerazdel);
//   let razdel = document.querySelector(`[data-razdel=${namerazdel}]`);
//   let y = razdel.getBoundingClientRect().y;
//   let otstupTop = y - 100;
//   window.scrollBy({
//     top: otstupTop,
//     behavior: "smooth",
//   });
// }
// //активация ссылки на раздел при прокрутке контента страницы
// function activatedNavLink(navlink) {
//   nl.forEach((elem) => {
//     elem.classList.remove("active");
//   });
//   navlink.classList.add("active");
// }
