import express from "express";
let app = express();
import { DateTime } from "luxon";
//app.use(DateTime);???????????????????? будет ли работать если раскоментировать а в adminController не импортировать???????
//Определим корневую папку
import __dirname from "./__dirname.js";
console.log(__dirname);
app.use(express.static(`${__dirname}/public/`));
//////////////////////////////////////////////////
//Подключаем шаблонизатор
import expressHandlebars from "express-handlebars";
const handlebars = expressHandlebars.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: {
    formatedDate: (date) => {
      let fDate = DateTime.fromISO(date)
        .setLocale("ru")
        .toFormat("cccc, dd LLL yyyy");
      return fDate;
    },
  },
});
app.engine("hbs", handlebars.engine);
//app.set("views", `${__dirname}/views/`);
app.set("view engine", "hbs");

//Подключаем библиотеку cookie-parser(для считывания установленной куки при авторизации)
import cookieParser from "cookie-parser";
import expressSession from "express-session";
let secret = "inspection";
app.use(cookieParser());

//Подключаем библиотеку expressSession

app.use(
  expressSession({
    secret: secret,
  })
);
//Подгружаем mongoose и коннектимся к базе forum
import mongoose from "mongoose";

const dbConnect = async () => {
  await mongoose.connect("mongodb://to:Prol62@localhost:27017/to");
};
dbConnect()
  .then(() => {
    console.log("Успешно подключились к базе to");
  })
  .catch((error) => {
    console.log("ошибка при подключении к базе данных");
    setTimeout(dbConnect, 5000);
    // return console.error(error);
  });
////////////////////////////////////////////////////////

import adminRouter from "./routes/admin.js";
import mainRouter from "./routes/main.js";

app.use(express.json());
app.use("/admin", adminRouter);
app.use("/", mainRouter);
app.use(function (req, res) {
  res.status(404).send("not found");
});
app.listen(3000, function () {
  console.log("running");
});
