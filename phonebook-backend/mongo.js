const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://phonebook:${password}@phonebook.shngf.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect(url);

const displayAll = async () => {
  const persons = await Person.find({});
  console.log('phonebook:');
  persons.forEach((person) => {
    console.log(person.name, person.number);
  });
  mongoose.connection.close();
};

const seedDB = async () => {
  const person = new Person({
    name,
    number,
  });
  const res = await person.save();
  console.log(`added ${res.name} number ${res.number} to phonebook`);
  mongoose.connection.close();
};

const argMissing = () => {
  console.log('Password, name and number are required: node mongo.js <password> <name> <number>');
  console.log('Or, to display all entries: node mongo.js <password>');
  process.exit(1);
};

if (process.argv.length === 3) {
  displayAll();
} else if (process.argv.length === 5) {
  seedDB();
} else {
  argMissing();
}
