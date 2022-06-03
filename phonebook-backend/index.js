const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("reqData", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 10000000);
};

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }
  if (persons.some((person) => person.name === body.name)) {
    return res
      .status(400)
      .json({ error: "name must be unique (it already exists on phonebook)" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).end();
  }
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
