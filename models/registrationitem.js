import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    ownerCar: {
      type: String,
      required: true,
    },
    aboutCar: {
      type: String,
    },
    dateRegistration: {
      type: Date,
    },
    timeRegistration: {
      type: Number,
      // required: true,
    },
    emailFeedback: {
      type: String,
    },
    telFeedback: {
      type: String,
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
    collection: "registrationitems",
    versionKey: false,
  }
);
newSchema.index({ dateRegistration: 1, timeRegistration: 1 }, { unique: true });
//Создаём модели
const registrationItem = mongoose.model("registrationItem", newSchema);
export default registrationItem;
