require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { errorHandler } = require("./middleware");
const Person = require("./models/person");

const app = express();

morgan.token("reqData", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan("tiny", {
    skip: (req, res) => {
      return req.method === "POST";
    },
  })
);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqData",
    {
      skip: (req, res) => {
        return req.method !== "POST";
      },
    }
  )
);

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
});

app.get("/api/persons", async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
  const body = req.body;
  try {
    if (!body.name || !body.number) {
      return res.status(400).json({ error: "name or number is missing" });
    }
    if (persons.some((person) => person.name === body.name)) {
      return res.status(400).json({
        error: "name must be unique (it already exists on phonebook)",
      });
    }
    const person = new Person({
      name: body.name,
      number: body.number,
    });
    const savedPerson = await person.save();

    res.json(savedPerson);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const person = persons.find((person) => person.id === id);
    if (!person) {
      return res.status(404).end();
    }
    res.json(person);
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  try {
    const person = {number: req.body.number}
    const updatedPerson = await Person.findByIdAndUpdate(req.params.id, person, {new: true})
    res.json(updatedPerson)
  } catch (err) {
   next(err) 
  }
})

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const result = await Person.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
