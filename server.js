const path = require('path');
const express = require('express');
const fs = require('fs');
const data = require('./db/db.json');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.json(data);
});

// Posts new note
app.post("/api/notes", (req, res) => {
    const updateData = req.body
    let id = 1;

    if (!data.lenght) id = 1; 
    else id = data[data.length - 1].id + 1
    updateData.id = id;

    data.push(updateData)

    fs.writeFile('./db/db.json', JSON.stringify(data), "utf-8", error => {
        if (error) return console.log(error);
        res.json(updateData);
    });
});


// Delete a note
app.delete("/api/notes/:id", (req, res) => {
    const deleteNotes = req.params.id;
    const index = data.findIndex(note => note.id === parseInt(deleteNotes))
    console.log(index);

    data.splice(index, 1);

    fs.writeFile('./db/db.json', JSON.stringify(data), "utf-8", error => {
        if (error) return console.log(error);
        res.json(data)
    });
});

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT, `  Go here --> http://localhost:${PORT}`);
})
