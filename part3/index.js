const { request } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();

const requestLogger = (request, response, next) =>{
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}


app.use(express.json());
app.use(morgan('tiny'));
//app.use(requestLogger);

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
];

app.get('/api/persons', (request, response) =>{
    response.json(persons);
});

app.get('/info', (request, response) => {
    info = `Phonebook has info for ${persons.length} people<br> ${new Date()}`;
    response.send(info);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if(person){
        response.json(person);
    }
    else{
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id);
    persons = persons.filter(note => note.id !== id);

    response.status(204).end();
});

const generateId = () =>{
    return Math.floor(Math.random() * 99999999999);
}

app.post('/api/persons', (request, response) =>{
    const body = request.body;

    if (!body.number){
        return response.status(400).json({
            error: 'number is missing'
        });
    }

    if (!body.name){
        return response.status(400).json({
            error: 'name is missing'
        });
    }
    else if(persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name needs to be unique'
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person);

    response.json(person);
});

app.use(unknownEndpoint);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
