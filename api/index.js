'use strict';

//basic api express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

//Middleware to parse json
app.use(express.json());

//Start upp api to listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Simple GET request
app.get('/getBook/:id/:key', (req, res) => { // Note to self. :id is the parameter. Don't need to put it in the url. Dont need : in the url
    const { id } = req.params;
    const { key } = req.params;
    res.send(getBookFromDB(id, key));
});

//POST request
app.post('/addBook', (req, res) => {
    const { book, lib } = req.body; //In body when sending data from client, varables need to be the same as the varables here
    if (isNewBookInLib(lib, book) == false) {
        addMoreDataToLocation(lib, book);
        res.send('Location added to database');
        return;
    }
    res.send('Location already in database');
});

//read from json
function readFromJson() {
    const fs = require('fs');
    let rawdata = fs.readFileSync('location.json');
    return JSON.parse(rawdata);
}

//write to json
//Add more data to location.json
function addMoreDataToLocation(lib, book) {
    const fs = require('fs');
    let rawdata = fs.readFileSync('location.json');
    let data = JSON.parse(rawdata);
    data.lib[lib].books.push({
        "name": book
    });
    fs.writeFile('location.json', JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

function isNewBookInLib(lib, book) {
    const fs = require('fs');
    let rawdata = fs.readFileSync('location.json');
    let json = JSON.parse(rawdata);
    let location = json.lib[lib];
    let books = location.books;
    for (let i = 0; i < books.length; i++) {
        if (books[i].name === book) {
            return i;
        }
    }
    return false;
}

//Find a location based on lib name
function getBookFromDB(lib, book) {
    const locations = readFromJson();
    try {
        const arrayPos = isNewBookInLib(lib, book);
        return locations.lib[lib].books[arrayPos].name;
    } catch (e) {
        console.log(locations.lib[lib].books[0]);
        return 'No such location';
    }
}

//Middleware takes care of 404
//If higher up in code, it will be called first for some reason. And wont go through with any api calls
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found. ERROR: 404'}) //send back 404
});