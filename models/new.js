import mongoose from "mongoose";
const Schema = mongoose.Schema;
// установка схемы
const newSchema = new Schema(
  {
    textNew: {
      type: String,
      required: true,
    },
  },

  {
    collection: "news",
    versionKey: false,
  }
);
//userSchema.index({ userLogin: 1, userPassword: 1 }, { unique: true });
//Создаём модели
const New = mongoose.model("New", newSchema);
export default New;
