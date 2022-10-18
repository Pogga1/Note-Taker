const express = require('express');
const path = require('path');
const dataBase = require('./Develop/db/db.json');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//html routes
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/develop/public/index.html'))
);
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/develop/public/notes.html'))
);
//api routes
app.get('/api/notes', (req, res) => {
    res.json(dataBase.slice(1));
});
app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, dataBase);
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    removeNote(req.params.id, dataBase);
    res.json(true);
})

const genNote = (body, notesArray) => {
    const newNote = body;
    if (!Array.isArray(notesArray)) notesArray=[];
    if (notesArray.length === 0) notesArray.push(0);

    body.id = notesArray.length; 
    notesArray[0]++ ;
    notesArray.push(newNote);

    fs.writeFileSync(path.join(__dirname, '/develop/db/db.json'),
        JSON.stringify(notesArray, null, 2 )
    );
    return newNote;
};

const removeNote = (id, notesArray) => {
for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];
    if (note.id == id) {
        notesArray.splice(i, 1);
        fs.writeFileSync(path.join(__dirname, '/develop/db/db.json'),
            JSON.stringify(notesArray, null, 2)
        );
        break;
    }
}
};

app.listen(PORT, () => {
    console.log(`Application listening at http://localhost:${PORT}`);
});