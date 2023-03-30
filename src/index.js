const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
// app.use(express.urlencoded());
const studentsList = require('./InitialData')


// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get('/api/student', (req, res) => {
    try {
        res.status(200).json(studentsList)
    }
    catch(err) {
        res.status(500).send({message: err.message})
    }
})

app.get('/api/student/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).send({message: 'Please provide id'});
    }
    const student =  studentsList.find(s => s.id === id);
    if (!student) {
        return res.status(404).send('Student Not Found');
    }
    res.status(200).json(student);
})

app.post('/api/student', (req, res) => {
    // const name = req.body.name;
    // const currentClass = req.body.currentClass;
    // const division = req.body.division;
    const {name, currentClass, division} = req.body
    if (!name || !currentClass || !division) {
       return res.status(400).send({message: 'Please provide all required fields'})
    }
    try {
        // const newId = studentsList.length > 0 ? studentsList[studentsList -1].id +1 : 1;
        const newStudent = {
            id: studentsList.length +1,
            name,
            currentClass,
            division
        }
        studentsList.push(newStudent);
        res.json({id: newStudent.id})
    }
    catch(err) {
        res.send({message: err.message})
    }
    
})
app.put('/api/student/:id', (req,res) => {
    const id = Number(req.params.id);
    const name = req.body.name
    if (!id || !req.body.name) {
        return res.status(400).send({message: 'Invalid id or Invalid update'});
    }
    const updateStudent = studentsList.find(s => s.id === id);
    if (!updateStudent) {
        return res.send({message: 'Student not found'});
    };
    updateStudent.name = name;
    res.json(updateStudent);
})
app.delete('/api/student/:id', (req,res) => {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).send({message: 'Please provide id'});
    }
    const studentIndex = studentsList.findIndex(s => s.id === id);
    if (studentIndex === -1) {
        return res.status(404).send('Student not found');
    }
    studentsList.splice(studentIndex, 1);
    res.status(200).send({message :'deleted successfully'})
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   