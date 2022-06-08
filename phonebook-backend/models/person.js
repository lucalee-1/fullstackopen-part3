require("dotenv").config();
const mongoose = require("mongoose");

const dbURI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connenting to MongoDB:", err.message);
  }
};

connectDB();

mongoose.connection.on("error", (err) => {
  logError(err);
});

const validatorFunc = (val) => {
let regex = new RegExp(/^[0-9]{2,3}-[0-9]+$/)
  return regex.test(String(val))
}
const validator = [validatorFunc, "Number should follow the format XX-XXXXXX or XXX-XXXXXX, with a min length of 8 characters"]

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    minlength: 8,
    validate: validator,   
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
