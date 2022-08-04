import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    nameTypeDay: {
      type: String,
      required: true,
    },
    regTypeDay: {
      type: String,
      require: true,
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
    collection: "typedays",
    versionKey: false,
  }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const TypeDay = mongoose.model("TypeDay", newSchema);
export default TypeDay;
