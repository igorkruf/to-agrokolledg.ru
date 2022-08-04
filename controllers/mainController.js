//Схемы документов
import News from "../models/new.js";
import TypeDays from "../models/typeday.js";
import Calendar from "../models/calendaritem.js";
import { DateTime } from "luxon";
import grafInspection from "../public/scripts/grafinspection.js";
import registrationItems from "../models/registrationitem.js";
import { to, necessary } from "../_services.js";
export default {
  main: async (req, res) => {
    console.log(req.cookies["to-registration"]);
    console.log(to);
    if (req.cookies["to-registration"]) {
      let registrationed = true;

      registrationItems.findById(
        req.cookies["to-registration"],
        (err, registrationItem) => {
          if (err) return console.log(err);
          console.log(registrationItem);
          //Проверяем есть ли регистрация с данным ID и если нет удаляем куку
          if (registrationItem) {
            let formatedDate = DateTime.fromJSDate(
              registrationItem.dateRegistration
            )
              .setLocale("ru")
              .toFormat("cccc, dd LLL ");
            console.log(formatedDate);
            console.log(grafInspection[registrationItem.timeRegistration]);
            let message = `Вы записаны на:<br>${formatedDate} в ${
              grafInspection[registrationItem.timeRegistration]
            }`;
            console.log(message);
            res.render("index", {
              necessary: necessary,
              to: to,
              title: "техосмотр в Красноуфимске",
              registrationed: registrationed,
              message: message,
              main: true,
            });
          } else {
            res.clearCookie("to-registration"); //удаляем куку о том что мы зарегистрированы
            res.render("index", {
              necessary: necessary,
              to: to,
              title: "техосмотр в Красноуфимске",
              main: true,
            });
          }
        }
      );
    } else {
      res.render("index", {
        necessary: necessary,
        title: "техосмотр в Красноуфимске",
        to: to,
        main: true,
      });
    }
  },
  getListNews: async (req, res) => {
    console.log("проверяем есть ли в базе объявления!!!");
    let listNews = await News.find({}).lean();
    console.log(listNews);
    if (listNews.length > 0) {
      res.json(listNews);
    }
  },
  registrationForm: (req, res) => {
    console.log("Подгружаем частичный шаблон презаписи");
    res.render("fetchpartial", {
      // title: "Предварительная запись",
      grafInspection: grafInspection,
      registration: true,
      layout: "fetch",
    });
  },
  addRegistration: (req, res) => {
    //Удаляем предидущую запись в базе о регистрации
    if (req.cookies["to-registration"]) {
      registrationItems.findById(
        req.cookies["to-registration"],
        (err, registrationItem) => {
          if (err) return console.log(err);
          registrationItems.deleteOne(
            { _id: req.cookies["to-registration"] },
            (err, result) => {
              if (err) return console.log(err);
            }
          );
        }
      );
    }
    //Добавляем в базу новую запись о регистрации
    //console.log(req.body);
    let addRegistration = new registrationItems({
      ownerCar: req.body.fio,
      aboutCar: req.body.car,
      dateRegistration: req.body.date,
      timeRegistration: req.body.time,
      emailFeedback: "",
      telFeedback: "",
      // emailFeedback: req.body.email,
      // telFeedback: req.body.tel,
    });

    addRegistration.save(function (err) {
      if (err) {
        //console.log(`ddddddd: ${err}`);

        res.status(201).json({
          message: "Ошибка при добавлении в базу. Попробуй ещё раз",
        });
      } else {
        console.log(req.session);
        console.log(req.cookies["to-registration"]);
        //проверяем session variable (админ ли я) и если я админ... то не создаём куку и можем добавлять в базу записи о регистрации не перезаписывая предидущую
        if (req.session.access == 1) {
          res.clearCookie("to-registration");
        } else {
          // console.log("Сохранен объект", addRegistration);
          // console.log(addRegistration._id.toString()); //получаем текстовое значение поля _id: new ObjectId("...")
          let nDate = new Date(); //Tекущая дата
          let registrationDate = new Date(req.body.date); //Дата регистрации
          let maxAge = registrationDate.getTime() - nDate.getTime(); //Вычисляем время жизни куки в миллисекундах
          res.cookie("to-registration", addRegistration._id.toString(), {
            maxAge: maxAge,
          }); //Создаем куки с опцией maxAge
        }
        res.status(200).json({
          message: "Вы успешно записались",
        });
      }
    });
  },
  getTime: async (req, res) => {
    console.log("Вычисляем график");
    let idRR;
    let ddd = new Date(req.body.date);
    console.log(req.body.date);
    //Выясним есть ли эта дата в рабочем календаре и если нет то определяем график работы по обычному
    let idRegRab = await Calendar.findOne({ dateDay: req.body.date }).lean();
    console.log(idRegRab);
    if (idRegRab) {
      console.log(`есть эта дата в календаре ${idRegRab.dateDay}`);
      idRR = idRegRab.typeDay;
      console.log(`ggg: ${idRR}`);
    } else {
      console.log(`ffffff:${ddd.getDay()}`);
      //если воскресенье то...
      if (ddd.getDay() == 0) {
        idRR = "62c1bb7c0fdbeab8ebd8fa4b";
      } else if (ddd.getDay() == 6) {
        //если суббота то...
        idRR = "62c1bb570fdbeab8ebd8fa48";
      } else {
        //если не суббота и не воскресенье то...
        idRR = "62c1a8830fdbeab8ebd8fa44";
      }
    }

    let rr = await TypeDays.findById(idRR);

    //преобразуем строку графика в массив
    let arr = rr.regTypeDay.split(",");
    //генерируем массив с временем(из коллекции registrationitems (по выбранной дате))

    let listRegistrationItems = await registrationItems
      .find({ dateRegistration: req.body.date })
      .lean();
    console.log(listRegistrationItems.length);
    let arrBusy;
    if (listRegistrationItems.length > 0) {
      console.log("есть запись на эту дату");
      arrBusy = listRegistrationItems.map((elem) => {
        return elem.timeRegistration.toString();
      });
      console.log(arrBusy);
    } else {
      console.log("нет записанных на эту дату");
      arrBusy = [];
    }
    //Сгенерируем массив из элементов массива arr отсутствующих в arrBusy
    let arrFree = [];
    for (let elem of arr) {
      if (arrBusy.indexOf(elem) == -1) arrFree.push(elem);
    }
    console.log(arrFree);
    //Сгенерируем объект из свободных часов ...

    let arrFreeFinal = [];
    let objFree = {};
    for (let elem of arrFree) {
      objFree = { id: elem, time: grafInspection[elem] };
      arrFreeFinal.push(objFree);
    }
    let working; //рабочий день
    console.log(arrFree[0]);
    if (arrFreeFinal.length > 0 && arrFree[0] != "") {
      working = true;
    } else {
      working = false;
    }
    console.log(`ppp:${working}`);
    res.render("fetchpartial", {
      //title: "Рабочий календарь",

      working: working, //Рабочий день
      arrFreeFinal: arrFreeFinal,
      getRegRab: true,
      layout: "fetch",
    });
  },
};
