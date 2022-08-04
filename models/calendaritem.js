import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    dateDay: {
      type: String,
      required: true,
      unique: true,
    },
    typeDay: {
      type: mongoose.Types.ObjectId,
      ref: "TypeDay",
    },

    // stopTypeDay: {
    //   type: Date,
    //   require: true,
    //   default: new Date(2200, 0, 1, 23, 59, 59),
    // },
    // parentTypeDay: {
    //   type: mongoose.Types.ObjectId,
    // },
  },

  {
    collection: "calendar",
    versionKey: false,
  }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const CalendarItem = mongoose.model("CalendarItem", newSchema);
export default CalendarItem;
