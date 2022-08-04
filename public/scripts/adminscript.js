console.log("подключили скрипты Админпанели");
// для форматирования даты
let DateTime = luxon.DateTime;

//let fd = DateTime.fromJSDate(ddd).setLocale("ru").toFormat("yyyy LLL dd");
//let fd = DateTime.fromISO(ddd).setLocale("ru").toFormat("yyyy LLL dd");
//console.log(fd);
let start = function () {
  //Для всплывающих подсказок
  let tooltip = document.querySelector(".tooltip");

  //для datepicker
  //исли выбран пункт меню Рабочий календарь
  let rabCalendar = document.querySelector(".formAddCalendarItem");

  if (rabCalendar) {
    //CalendarItem
    let listCalendarItemMenudel = document.querySelectorAll(
      ".listCalendar__item-menudel"
    );
    listCalendarItemMenudel.forEach(function (elem) {
      elem.addEventListener("click", function () {
        console.log("кликнули по корзине");
        let id = this.lastElementChild.value;
        console.log(this.firstElementChild);
        console.log(this.lastElementChild);
        this.firstElementChild.classList.toggle("del__confirm-visible");

        this.querySelector(".delcalendaritem").addEventListener(
          "click",
          async function () {
            let response = await fetch(`/admin/delcalendaritem/${id}`, {
              method: "DELETE",
            });
            let result = await response.json();
            if (response.status == 200) {
              tooltip.classList.add("tooltip-good");
              console.log();
              this.parentElement.parentElement.parentElement.parentElement.parentElement.removeChild(
                this.parentElement.parentElement.parentElement.parentElement
              );
            } else {
              tooltip.classList.add("tooltip-error");
            }
            tooltip.innerHTML = result.message;
            setTimeout(() => {
              console.log("удаляем классы у tooltip");
              tooltip.classList.remove("tooltip-good");
              tooltip.classList.remove("tooltip-error");
            }, 6000);
          }
        );
        //   async function () {
        //     // event.stopPropagation();
        //     console.log(id);
        //     console.log("привет ты подтвердил удаление объявления");
        //     let response = await fetch(`/admin/delnews/${id}`, {
        //       method: "DELETE",
        //     });
        //     let result = await response.json();
        //     console.log(result);
        //     if (result.del == "Ok") {
        //       elem.parentElement.parentElement.style.display = "none";
        //    }
      });
    });

    // /////////////////////////////////////////////////////////////////
    // let listCalendarItemMenudel = document.querySelectorAll(
    //   ".listCalendar__item-menudel"
    // );
    // console.log(listCalendarItemMenudel);
    // listCalendarItemMenudel.forEach(function (elem) {
    //   elem.addEventListener("click", async function () {
    //     let response = await fetch(
    //       `/admin/delcalendaritem/${this.previousElementSibling.value}`,
    //       {
    //         method: "DELETE",
    //       }
    //     );
    //     let result = await response.json();
    //     if (response.status == 200) {
    //       tooltip.classList.add("tooltip-good");
    //       this.parentElement.parentElement.removeChild(this.parentElement);
    //     } else {
    //       tooltip.classList.add("tooltip-error");
    //     }
    //     tooltip.innerHTML = result.message;
    //     setTimeout(() => {
    //       console.log("удаляем классы у tooltip");
    //       tooltip.classList.remove("tooltip-good");
    //       tooltip.classList.remove("tooltip-error");
    //     }, 6000);
    //   });
    //   this;
    // });
    // ///////////////////////////////////////////////////////
    // listCalendarItemMenudel.addEventListener("click", () => {
    //   console.log("удаляем день из рабочего календаря");
    // });
    /////////////////////////////////////////////////////////////////
    let selectedDate;
    let formatedDate;
    let inp = rabCalendar.querySelector(".choiceDate");

    let minDate = new Date();
    // maxDate = new Date();
    // // увеличиваем текущую дату на 1 месяц
    // maxDate.setMonth(minDate.getMonth() + 1);
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

      onSelect: async (instance, data) => {
        console.log(data);
        formatedDate = DateTime.fromJSDate(data)
          .setLocale("ru")
          .toFormat("cccc, dd LLL yyyy");
        // const formatedDate = new Intl.DateTimeFormat("ru", {
        //   dateStyle: "long",
        // }).format(data);
        let span = document.querySelector(".formateddate");
        span.innerHTML = formatedDate;
        //Присваиваем значение "глобальной :)" переменной selectedDate, объявленной выше
        selectedDate = data;
      },
    });
    let listCalendar = document.querySelector(".listCalendar");
    let idTypeDay = rabCalendar.querySelector(".formAddCalendarItem__type");
    let addDayBtn = rabCalendar.querySelector(".formAddCalendarItem__addbtn");
    addDayBtn.addEventListener("click", async () => {
      let response = await fetch("/admin/calendar", {
        method: "POST",
        body: JSON.stringify({
          date: selectedDate,
          idTypeDay: idTypeDay.value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      // if (response.status == 200) {
      //   console.log("День добавлен");
      //   let result = await response.json();
      //   console.log(result);
      // }
      let result = await response.json();
      if (response.status == 200) {
        tooltip.classList.add("tooltip-good");
        let sec = document.createElement("section");
        sec.classList.add("listCalendar__item");
        sec.classList.add("grid");
        sec.innerHTML = `<section class='listCalendar__item-opisanie'>${formatedDate} </section><section></section>`;
        //console.log(section);
        console.log(this);
        listCalendar.prepend(sec);
      } else {
        tooltip.classList.add("tooltip-error");
      }
      tooltip.innerHTML = result.message;
      setTimeout(() => {
        console.log("удаляем классы у tooltip");
        tooltip.classList.remove("tooltip-good");
        tooltip.classList.remove("tooltip-error");
      }, 6000);
    });
  }

  ///////////////////////////////////////////////

  //устанавливаем режим работы пункта(в данном примере даем 30 минут на одно транспортное средство)
  // let grafInspection = [
  //   "9:00",
  //   "9:30",
  //   "10:00",
  //   "10:30",
  //   "11:00",
  //   "11:30",
  //   "13:00",
  //   "13:30",
  //   "14:00",
  //   "14:30",
  //   "15:00",
  //   "15:30",
  //   "16:00",
  //   "16:30",
  // ];

  let razdelRegRab = document.querySelector(".razdelRegRab");
  //Если выбран пункт меню Режимы работы
  if (razdelRegRab) {
    //Выводим в секцию с классом grafInspection график проверки
    // let regRab = document.querySelector(".grafInspection");

    // grafInspection.forEach((elem, index) => {
    //   let span = document.createElement("span");
    //   span.innerHTML = `<b>${index}</b>: ${elem}`;
    //   regRab.appendChild(span);
    // });

    /////////////////////////////////////////////
    //Для редактирования и удаления режимов

    //для формы добавления типа режима работы
    const btnAddRegRab = document.querySelector(".addRegRab");
    const inputNameType = document.querySelector(".nametype");
    const inputRegType = document.querySelector(".regtype");

    btnAddRegRab.addEventListener("click", async () => {
      let response = await fetch("/admin/regrab", {
        method: "POST",
        body: JSON.stringify({
          nameType: inputNameType.value,
          regType: inputRegType.value,
        }),
        headers: { "Content-Type": "application/json" },
      });
    });
  }
  ////////////////////////////////////////////
  //для формы добавления дня в рабочий календарь

  // let calendarItemAddBtn = document.querySelector(
  //   ".formAddCalendarItem__addbtn"
  // );
  // // if (calendarItemAddBtn) {
  //   //console.log(calendarItemAddBtn);
  //   calendarItemAddBtn.addEventListener("click", () => {
  //     console.log("добавляем день в календарь");
  //   });
  // // }
  ///////////////////////

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
  let modalcloseeditnews = document.querySelector("#closeeditnews");
  modalcloseeditnews.addEventListener("click", () => {
    wrapmodal.classList.remove("visible");
  });
  // страница админки со списком объявлений
  //клик по иконке редактировать новость
  let lblsedit = document.querySelectorAll(".edit");
  lblsedit.forEach((elem, i) => {
    elem.addEventListener("click", function () {
      console.log(`кликнули по карандашу${i}`);
      wrapmodal.classList.add("visible");
      console.log(this.parentElement.nextElementSibling.innerHTML);
      tinymce.activeEditor.setContent(
        this.parentElement.nextElementSibling.innerHTML
      );
      let idnews = this.querySelector(".idnews");
      let btnsavenews = modal.querySelector(".form__btn-savenews");
      let rrr = this;
      btnsavenews.addEventListener("click", async function () {
        //console.log(rrr);
        let changedTextNew = tinymce.activeEditor.getContent("#mytextarea");
        console.log(changedTextNew);
        let response = await fetch("/admin/savechangesnews", {
          method: "PUT",
          body: JSON.stringify({
            idNews: idnews.value,
            textNews: changedTextNew,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let result = await response.json();
        console.log(result);
        if (result.itog == "Ok") {
          tinymce.activeEditor.setContent("");
          console.log(rrr.parentElement);
          rrr.parentElement.nextElementSibling.innerHTML = changedTextNew;

          wrapmodal.classList.remove("visible");
        }
      });
    });
  });
  let lblsdel = document.querySelectorAll(".del");
  console.log(lblsdel);
  lblsdel.forEach((elem) => {
    elem.addEventListener("click", function () {
      console.log("кликнули по корзине");
      let id = this.lastElementChild.value;
      console.log(this.firstElementChild);
      console.log(this.lastElementChild);
      this.firstElementChild.classList.toggle("del__confirm-visible");

      //Удаляем новость (если есть элемент...)
      if (this.querySelector(".delnews")) {
        this.querySelector(".delnews").addEventListener(
          "click",
          async function () {
            // event.stopPropagation();
            console.log(id);
            console.log("привет ты подтвердил удаление объявления");
            let response = await fetch(`/admin/delnews/${id}`, {
              method: "DELETE",
            });
            let result = await response.json();
            console.log(result);
            if (result.del == "Ok") {
              elem.parentElement.parentElement.style.display = "none";
            }
          }
        );
      }
      /////////////////////////////////////////////////////////////////
      //Удаляем предварительную запись (если есть элемент...)
      if (this.querySelector(".delregistration")) {
        this.querySelector(".delregistration").addEventListener(
          "click",
          async function () {
            // event.stopPropagation();
            console.log(id);
            console.log("привет ты подтвердил удаление предворительной записи");
            let response = await fetch(`/admin/delregistration/${id}`, {
              method: "DELETE",
            });
            let result = await response.json();
            console.log(result);
            if (result.del == "Ok") {
              elem.parentElement.parentElement.style.display = "none";
            }
          }
        );
      }
    });
  });

  //////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  console.log("Добавление объявления");
  //let tooltip = document.querySelector(".tooltip");
  let btnAddNews = document.querySelector(".form__btn-addnew");
  btnAddNews.addEventListener("click", async () => {
    let textnew = tinymce.activeEditor.getContent("mytextarea");
    let res = await fetch("/admin/addnews", {
      method: "POST",
      body: JSON.stringify({ textNew: textnew }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let result = await res.json();
    console.log(result);
    if (res.status == 200) {
      tooltip.classList.add("tooltip-good");

      tinymce.activeEditor.setContent("");
    } else {
      tooltip.classList.add("tooltip-error");
    }
    tooltip.innerHTML = result.message;
    setTimeout(() => {
      console.log("удаляем классы у tooltip");
      tooltip.classList.remove("tooltip-good");
      tooltip.classList.remove("tooltip-error");
    }, 6000);
  });
};
//////////////////////////////////////////////////
//Запускаем функцию start только после того как браузер полностью построен DOM HTML страницы .
document.addEventListener("DOMContentLoaded", start);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
