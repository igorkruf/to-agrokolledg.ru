//Схемы документов
import News from "../models/new.js";
import Helpers from "../_helpers.js";
import TypeDays from "../models/typeday.js";
import Calendar from "../models/calendaritem.js";
import grafInspection from "../public/scripts/grafinspection.js";
import registrationItem from "../models/registrationitem.js";
import { DateTime } from "luxon";
import md5 from "md5";
// import User from "../models/user.js";
// import jwt from "jsonwebtoken";
// const TOKEN_KEY = "inspection";
let password = "9025097488";
let hashPassword = md5(password);

export default {
  delCalendarItem: async (req, res) => {
    console.log(`Удаляем день из календаря: ${req.params.id}`);
    Calendar.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        res.json({ message: "День удалён и примет значение по умолчанию" });
      } else {
        res.json({ message: "Ошибка при удалении дня..." });
      }
    });
  },
  addCalendarItem: async (req, res) => {
    // удаляем все дни с прошедшими датами
    console.log("Удаляем прошедшие даты");

    Calendar.deleteMany(
      { dateDay: { $lt: new Date().toISOString() } }, //так как дата храниться в базе в формате ISOstring
      function (err, result) {
        if (err) return console.log(err);
        console.log(result);
      }
    );
    console.log(`добавляем в календарь день: ${req.body.idTypeDay}`);
    let addedDate = new Calendar({
      dateDay: req.body.date,
      typeDay: req.body.idTypeDay,
    });
    addedDate.save(function (err) {
      if (err) {
        console.log(err);
        res.status(201).json({
          message:
            "Ошибка при добавлении дня в календарь (скорее всего такая дата уже есть) Попробуй ещё раз",
        });
      } else {
        console.log("Сохранен объект", addedDate);
        res.status(200).json({
          message: "День успешно добавлен в календарь",
        });
      }
    });
  },
  listCalendarItem: async (req, res) => {
    if (req.session.access == 1) {
      console.log("добавляем день в календарь");
      const getListTypeDays = TypeDays.find({}).lean();
      const getListCalendarItem = Calendar.find({})
        .sort({ dateDay: 1 })
        .populate("typeDay")
        .lean();

      let [listTypeDays, listCalendarItem] = await Promise.all([
        getListTypeDays,
        getListCalendarItem,
      ]);
      // let listCalendarItem= await
      console.log(listCalendarItem);
      console.log(req.session.access);
      res.render("admin", {
        title: "Рабочий календарь",
        listTypeDays: listTypeDays,
        listCalendarItem: listCalendarItem,
        CalendarItems: true,
        layout: "admin",
      });
    } else {
      res.redirect("/admin");
    }
  },

  addTypeDay: async (req, res) => {
    console.log(req.body);
    let addRegRab = new TypeDays({
      nameTypeDay: req.body.nameType,
      regTypeDay: req.body.regType,
    });
    addRegRab.save(function (err) {
      if (err) {
        console.log(err);
        res.status(201).json({
          message:
            "Ошибка при добавлении режима в базу (скорее всего не набрал текст) Попробуй ещё раз",
        });
      } else {
        console.log("Сохранен объект", addRegRab);
        res.status(200).json({
          message: "Режим успешно добавлен в базу",
        });
      }
    });
  },
  getTypeDay: async (req, res) => {
    //устанавливаем режим работы пункта(в данном примере даем 30 минут на одно транспортное средство)
    if (req.session.access == 1) {
      ////////////////////////////////////////////////////////////////////////////////////////////////
      let listTypeDays = await TypeDays.find({}).lean();
      console.log(listTypeDays);
      //console.log(req.session.access);
      res.render("admin", {
        title: "Красноуфимск",
        grafInspection: grafInspection,
        listTypeDays: listTypeDays,
        getRegRab: true,
        layout: "admin",
      });
    } else {
      res.redirect("/admin");
    }
  },

  saveChangesNews: (req, res) => {
    console.log("Изменяем объявление");
    console.log(req.body.idNews);
    console.log(req.body.textNews);
    News.updateOne(
      { _id: req.body.idNews },
      { textNew: req.body.textNews },
      function (err, result) {
        if (err) return console.log(err);
        //console.log(result);
        if (result.modifiedCount > 0) {
          res.json({ itog: "Ok" });
        }
      }
    );
  },

  formaddnews: (req, res) => {
    console.log("форма добавления новости node ");
    res.render("admin", {
      title: "Добавление объявления",
      addNews: true,
      layout: "admin",
    });
  },
  addNews: (req, res) => {
    console.log("Добавляем объявление");
    console.log(req.body.textNew);
    let addnews = new News({
      textNew: req.body.textNew,
    });
    addnews.save(function (err) {
      if (err) {
        console.log(err);
        res.status(201).json({
          message:
            "Ошибка при добавлении объявления в базу (скорее всего не набрал текст) Попробуй ещё раз",
        });
      } else {
        console.log("Сохранен объект", addnews);
        res.status(200).json({
          message: "Объявление успешно добавлено в базу",
        });
      }
    });
  },

  getListNews: async (req, res) => {
    console.log("Получаем список объявлений");
    let listNews = await News.find({}).lean();
    //console.log(listNews);
    res.render("admin", {
      title: "Список объявлений",
      listNews: listNews,
      getListNews: true,
      layout: "admin",
    });
  },
  delNews: (req, res) => {
    console.log(req.params.id);
    News.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        res.json({ del: "Ok" });
      }
    });
  },
  panel: (req, res, next) => {
    console.log("главная админ");
    // console.log(req.cookies.hash);
    // console.log(req.signedCookies);

    //console.log(access);
    //////////////////////////////////////////////////
    if (req.cookies.hash == hashPassword) {
      req.session.access = 1;
      console.log("header authorization есть");
      res.render("admin", {
        title: "Красноуфимск",
        layout: "admin",
      });
    } else {
      //   console.log("dfdshgsdfghkj");
      delete req.session.access;
      res.render("formlogin", {
        title: "Ввод пароля",
        layout: "login",
      });
    }
    // //////////////////////////////////////////////////////////////////////
    // jwt.verify(
    //   req.headers.authorization.split(" ")[1],
    //   TOKEN_KEY,
    //   (err, payload) => {
    //     if (err) {
    //       console.log("Ошибка при проверке токена");
    //       res.redirect("/admin/login");
    //     } else {
    //       console.log(payload);
    //       res.redirect("/admin/panel");
    //     }
    //   }
    // );
  },

  login: (req, res) => {
    console.log("принял хэш");

    res.render("admin", {
      title: "Авторизация11111 техосмотр Красноуфимск",
      layout: "admin",
    });
  },
  loginIn: (req, res) => {
    console.log(req.body.password);
    if (md5(req.body.password) == hashPassword) {
      console.log("Вы админ!!!");
      let hash = md5(req.body.password);
      res.clearCookie("to-registration");
      res.cookie("hash", hash);
      res.send();
      // res.json({
      //   token: jwt.sign({ hash: hash }, TOKEN_KEY),
      // });
    } else {
      console.log("Пароль не верен");
      res.status(201).send();
      //res.send();
    }
  },
  getListRegistration: async (req, res) => {
    if (req.session.access == 1) {
      registrationItem.deleteMany(
        { dateRegistration: { $lt: new Date() } },
        function (err, result) {
          if (err) return console.log(err);

          console.log(result);
        }
      );
      // //Сформируем нужный нам массив (обратившись к базе данных один раз)
      let listRegistrationAdmin = [];
      let listDateRegistration = []; //для фильтрации

      // // 1. Выберем все записи из коллекции РЕГИСТРАЦИЯ
      let listRegistration = await registrationItem.find({}).lean();

      //2. Генерируем массив дат (на которые есть записи)
      listRegistration.forEach((elem) => {
        console.log(elem.dateRegistration);
        if (
          !listDateRegistration.includes(elem.dateRegistration.toISOString())
        ) {
          console.log(
            `нет в массиве даты - ${elem.dateRegistration.toISOString()}`
          );
          listDateRegistration.push(elem.dateRegistration.toISOString());
        }
      });
      console.log(listDateRegistration);

      listDateRegistration.forEach((element) => {
        let itog = {};
        let finalListRegistrationDay = [];
        listRegistration.forEach((el) => {
          if (el.dateRegistration.toISOString() == element) {
            finalListRegistrationDay.push(el);
          }
        });
        itog["items"] = finalListRegistrationDay;
        itog["date_registration"] = element;
        listRegistrationAdmin.push(itog);
      });
      console.log(listRegistrationAdmin);
      // /////////////////////////////////////////////////////////////////////////////////////////////
      //
      // let itog = []; //массив занятого времени выбранной даты

      // let listRegistrationDate = await registrationItem.distinct(
      //   "dateRegistration"
      // );
      // console.log(listRegistrationDate);
      ////////////////////////////////////////////////////////////
      // for (let registrationDate of listRegistrationDate) {
      //   let dayRegistration = {};
      //   let listRegistrationDateItems = await registrationItem
      //     .find({
      //       dateRegistration: registrationDate,
      //     })
      //     .lean();
      //   let formatedDate = DateTime.fromJSDate(registrationDate)
      //     .setLocale("ru")
      //     .toFormat("cccc, dd LLL ");
      //   dayRegistration["date"] = formatedDate;
      //   dayRegistration["items"] = listRegistrationDateItems;
      //   itog.push(dayRegistration);
      // }
      // console.log(itog);
      /////////////////////////////////////////////////////////////////////////////////
      // await Promise.all(
      //   listRegistrationDate.map(async (element) => {
      //     let dayRegistration = {};
      //     let listRegistrationDateItems = await registrationItem
      //       .find({
      //         dateRegistration: element,
      //       })
      //       .lean();
      //     let formatedDate = DateTime.fromJSDate(element)
      //       .setLocale("ru")
      //       .toFormat("cccc, dd LLL ");
      //     dayRegistration["date"] = formatedDate;

      //     dayRegistration["items"] = listRegistrationDateItems;
      //     itog.push(dayRegistration);
      //   })
      // );

      // console.log(itog);
      // //console.log(req.session.access);
      ///////////////////////////////////////////////////////
      res.render("admin", {
        title: "Список зарегистрированных",
        ggg: "5555555555",
        // grafInspection: grafInspection,
        listRegistrationItems: listRegistrationAdmin,
        getListRegistration: true,
        helpers: {
          getTimeRegistrationFromId: Helpers.getTimeRegistrationFromId,
          getWeekDay: Helpers.getWeekDay,
        },
        layout: "admin",
      });
      ////////////////////////////////////////////////
    } else {
      res.redirect("/admin");
    }
  },
  delRegistration: (req, res) => {
    console.log(`Удаляем регистрацию: ${req.params.id}`);
    registrationItem.deleteOne({ _id: req.params.id }, function (err, result) {
      if (err) return console.log(err);
      console.log(result);
      if (result.deletedCount != 0) {
        res.json({ del: "Ok" });
      }
    });
  },
  // // addUser: async (req, res) => {
  //   //console.log(req.body);
  //   //let itogPassword = passwordHash.generate(req.body.pwdUser);
  //   let itogPassword = md5(req.body.pwdUser);
  //   let user = new User({
  //     userName: req.body.nameUser,
  //     userLogin: req.body.loginUser,
  //     userPassword: itogPassword,
  //   });
  //   user.save(function (err, newuser) {
  //     if (err) {
  //       console.log(err);
  //       //Если err.code == 11000 (есть уже пара логин: пароль)то
  //       if (err.code == 11000) {
  //         res.json({ code: 2 });
  //       } else {
  //         console.log(err.code);
  //         res.json({ code: 0 });
  //       }
  //     } else {
  //       //console.log(newuser);
  //       res.json({
  //         code: 1,
  //         token: jwt.sign({ id: newuser._id }, TOKEN_KEY),
  //         user: newuser,
  //       });
  //     }
  //   });
  //   //console.log(`newUser: ${newUser}`);
  // if (/^\S+$/.test(req.body.loginUser) && /^\S+$/.test(req.body.pwdUser)) {
  // } else {
  //   res.json({ massege: "Логин и пароль не должны содержать пробелы!!!" });
  // }
  // const user =new User({

  // })
  // console.log(`добавляем пользователя: ${user}`);
  // },
};
