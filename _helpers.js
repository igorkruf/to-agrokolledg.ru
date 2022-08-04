import grafInspection from "./public/scripts/grafinspection.js";
import { DateTime } from "luxon";
export default {
  getTimeRegistrationFromId: (timeId) => {
    return grafInspection[timeId];
  },
  getWeekDay: (dateFromDb) => {
    let date = new Date(dateFromDb);
    let formatedDate = DateTime.fromJSDate(date)
      .setLocale("ru")
      .toFormat("cccc, dd LLL ");

    return formatedDate;
  },
};
